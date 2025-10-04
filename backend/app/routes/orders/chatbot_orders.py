from flask import Blueprint, request, jsonify
from app import db
from app.models.Order import Order, OrderItem
from app.models.products import Product
from app.models.User import User
from app.services.mpesa_service import MpesaService
import jwt
from functools import wraps
from decimal import Decimal
import re

chatbot_bp = Blueprint("chatbot_orders", __name__)

# JWT configuration
JWT_SECRET_KEY = "super-secret-jwt"
JWT_ALGORITHM = "HS256"

# ========== TOKEN DECORATOR ==========
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get("access_token")

        if not token:
            return jsonify({"success": False, "message": "Token is missing"}), 401

        try:
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            current_user = User.query.get(data["user_id"])
            if not current_user:
                return jsonify({"success": False, "message": "Invalid token"}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({"success": False, "message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"success": False, "message": "Invalid token"}), 401

        return f(current_user, *args, **kwargs)

    return decorated

# ========== PHONE NUMBER NORMALIZATION ==========
def normalize_phone_number(phone_number):
    """
    Normalize phone number to 254 format for M-Pesa
    Handles: +254..., 254..., 07..., 011...
    """
    if not phone_number:
        return None
    
    # Remove any non-digit characters except +
    cleaned = re.sub(r'[^\d+]', '', phone_number)
    
    # Handle +254 format
    if cleaned.startswith('+254'):
        return '254' + cleaned[4:]
    
    # Handle 254 format
    if cleaned.startswith('254') and len(cleaned) == 12:
        return cleaned
    
    # Handle 07... format (convert to 2547...)
    if cleaned.startswith('07') and len(cleaned) == 10:
        return '254' + cleaned[1:]
    
    # Handle 7... format (direct)
    if cleaned.startswith('7') and len(cleaned) == 9:
        return '254' + cleaned
    
    # If it's already 12 digits but starts with something else, try to fix
    if len(cleaned) == 12 and not cleaned.startswith('254'):
        # Try to extract last 9 digits and prepend 254
        last_9 = cleaned[-9:]
        if last_9.startswith('7'):
            return '254' + last_9
    
    return None

# ========== AI PRODUCT DETECTION ==========
def detect_product_order(message, language='en'):
    """
    Advanced product and quantity detection from natural language
    """
    message_lower = message.lower().strip()
    
    # Get ALL products (both available and unavailable) for comprehensive matching
    all_products = Product.query.all()
    
    # Enhanced patterns for both languages
    patterns = {
        'en': [
            # "I want 5 cooking oil"
            (r'(?:i\s+want|i\s+need|give\s+me|order|buy|get)\s+(\d+)\s+(.+)', (1, 2)),
            # "5 cooking oil"
            (r'(\d+)\s+(.+)', (1, 2)),
            # "cooking oil 5"
            (r'(.+?)\s+(\d+)(?:\s|$)', (2, 1)),
            # "I'd like 3 bags of rice"
            (r'(?:i\'\s*d\s+like|i\s+would\s+like)\s+(\d+)\s+(.+)', (1, 2)),
        ],
        'sw': [
            # "Nataka mafuta ya kupikia 5"
            (r'(?:nataka|nahitaji|nipe|agiza|nunua|leta)\s+(.+?)\s+(\d+)', (2, 1)),
            # "5 mafuta ya kupikia"
            (r'(\d+)\s+(.+)', (1, 2)),
            # "mafuta ya kupikia 5"
            (r'(.+?)\s+(\d+)(?:\s|$)', (2, 1)),
            # "Ningependa kupata 3 mchele"
            (r'(?:ningependa|napenda)\s+(?:kupata|kuagiza)\s+(\d+)\s+(.+)', (1, 2)),
        ]
    }
    
    lang_patterns = patterns.get(language, patterns['en'])
    
    for pattern, groups in lang_patterns:
        match = re.search(pattern, message_lower, re.IGNORECASE)
        if match:
            try:
                quantity = int(match.group(groups[0]))
                raw_product_name = match.group(groups[1]).strip()
                
                if quantity <= 0:
                    continue
                
                # Clean product name
                stop_words = {
                    'en': ['please', 'thanks', 'thank you', 'i want', 'i need', 'give me', 'order', 'buy', 'get', 'of'],
                    'sw': ['tafadhali', 'asante', 'nataka', 'nahitaji', 'nipe', 'agiza', 'nunua', 'leta', 'ya']
                }
                
                for word in stop_words.get(language, []):
                    raw_product_name = re.sub(r'\b' + word + r'\b', '', raw_product_name, flags=re.IGNORECASE)
                
                product_name = re.sub(r'\s+', ' ', raw_product_name).strip()
                
                if product_name:
                    # Try to find the best matching product from ALL products
                    best_product = find_best_product_match(product_name, all_products)
                    if best_product:
                        return {
                            'quantity': quantity,
                            'product_name': product_name,
                            'product': best_product,
                            'match_confidence': 'high',
                            'is_available': best_product.stock > 0
                        }
                    
            except (ValueError, IndexError):
                continue
    
    # If no quantity specified, check if it's just a product mention from ALL products
    for product in all_products:
        product_lower = product.name.lower()
        # Check if product name is mentioned in the message
        if product_lower in message_lower or any(word in message_lower for word in product_lower.split()):
            return {
                'quantity': None,  # No quantity specified
                'product_name': product.name,
                'product': product,
                'match_confidence': 'medium',
                'is_available': product.stock > 0
            }
    
    return None

def find_best_product_match(product_name, products):
    """
    Find the best matching product using multiple strategies
    """
    product_name_lower = product_name.lower()
    
    # Strategy 1: Exact match
    for product in products:
        if product.name.lower() == product_name_lower:
            return product
    
    # Strategy 2: Contains match
    for product in products:
        if product_name_lower in product.name.lower() or product.name.lower() in product_name_lower:
            return product
    
    # Strategy 3: Word overlap with scoring
    best_match = None
    best_score = 0
    
    product_words = set(product_name_lower.split())
    
    for product in products:
        product_name_words = set(product.name.lower().split())
        overlap = len(product_words.intersection(product_name_words))
        
        # Calculate score based on overlap and string similarity
        if overlap > 0:
            # Additional points for longer matches
            score = overlap * 2
            
            # Check for partial matches within words
            for p_word in product_words:
                for prod_word in product_name_words:
                    if p_word in prod_word or prod_word in p_word:
                        score += 1
            
            if score > best_score:
                best_score = score
                best_match = product
    
    if best_score >= 1:  # Require at least some meaningful match
        return best_match
    
    # Strategy 4: Try category matching
    for product in products:
        if product.category and product_name_lower in product.category.lower():
            return product
    
    return None

# ========== CHATBOT ENDPOINTS ==========

@chatbot_bp.route("/chatbot/analyze-message", methods=["POST"])
@token_required
def analyze_chat_message(current_user):
    """
    Analyze chat message and detect product orders with improved AI
    """
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({"success": False, "message": "Message is required"}), 400
        
        message = data['message'].strip()
        language = data.get('language', 'en')
        
        if not message:
            return jsonify({
                "success": True,
                "type": "general",
                "message": "Hello! How can I help you with your order today?"
            }), 200
        
        # Detect product order from ALL products (including unavailable ones)
        order_info = detect_product_order(message, language)
        
        if not order_info:
            # No product detected at all
            return jsonify({
                "success": True,
                "type": "general",
                "message": "I'd be happy to help you order! Please tell me what product you'd like and how many. For example: 'I want 2 bags of rice' or 'Nataka mafuta ya kupikia 3'"
            }), 200
        
        product = order_info['product']
        
        if not product:
            return jsonify({
                "success": True,
                "type": "product_not_found",
                "message": f"I couldn't find '{order_info['product_name']}' in our inventory. Here are some available products: {get_available_products_sample()}",
                "original_message": message
            }), 200
        
        # Check stock availability - THIS IS THE KEY FIX
        if not order_info['is_available']:
            return jsonify({
                "success": True,
                "type": "out_of_stock",
                "message": f"I'm sorry, {product.name} is currently out of stock.",
                "product_name": product.name,
                "original_message": message
            }), 200
        
        # Handle case where no quantity specified
        if order_info['quantity'] is None:
            return jsonify({
                "success": True,
                "type": "need_quantity",
                "message": f"Great! {product.name} is available. We have {product.stock} units in stock. How many would you like to order?",
                "product": product.to_dict(),
                "original_message": message
            }), 200
        
        quantity = order_info['quantity']
        
        # Check if sufficient stock
        if product.stock < quantity:
            return jsonify({
                "success": True,
                "type": "insufficient_stock",
                "message": f"I'm sorry, we only have {product.stock} units of {product.name} available. Would you like to order {product.stock} instead?",
                "product_name": product.name,
                "available_stock": product.stock,
                "requested_quantity": quantity,
                "product": product.to_dict(),
                "original_message": message
            }), 200
        
        # Product is available with specified quantity
        total_amount = float(product.price) * quantity
        
        return jsonify({
            "success": True,
            "type": "product_available",
            "message": f"Perfect! {product.name} is available. I can order {quantity} units for you at KSh {total_amount:.2f}.",
            "product": product.to_dict(),
            "quantity": quantity,
            "total_amount": total_amount,
            "confirmation_message": f"Shall I proceed with ordering {quantity} {product.name} for KSh {total_amount:.2f}?",
            "customer_name": f"{current_user.first_name}",
            "original_message": message
        }), 200
        
    except Exception as e:
        print(f"Error analyzing chat message: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "message": "I encountered an error processing your request. Please try again."
        }), 500

def get_available_products_sample():
    """Get a sample of available products for suggestions"""
    products = Product.query.filter(Product.stock > 0).limit(5).all()
    if not products:
        return "No products available at the moment."
    
    product_names = [p.name for p in products]
    if len(product_names) == 1:
        return product_names[0]
    elif len(product_names) == 2:
        return " and ".join(product_names)
    else:
        return ", ".join(product_names[:-1]) + ", and " + product_names[-1]

@chatbot_bp.route("/chatbot/confirm-order", methods=["POST"])
@token_required
def confirm_chatbot_order(current_user):
    """
    Confirm and process chatbot order with STK Push - FIXED PHONE NUMBER
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400
        
        required_fields = ['product_id', 'quantity', 'total_amount']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "message": f"Missing required field: {field}"}), 400
        
        product_id = data['product_id']
        quantity = data['quantity']
        total_amount = data['total_amount']
        
        # Verify product exists and has sufficient stock
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"success": False, "message": "Product not found"}), 404
        
        if product.stock < quantity:
            return jsonify({
                "success": False, 
                "message": f"Sorry, only {product.stock} units of {product.name} are available now."
            }), 400
        
        # NORMALIZE PHONE NUMBER PROPERLY
        phone_number = normalize_phone_number(current_user.phone_number)
        
        if not phone_number:
            return jsonify({
                "success": False,
                "message": "Unable to process payment. Please ensure your phone number is registered in the correct format (e.g., 254712345678)."
            }), 400
        
        print(f"Processing order with phone: {phone_number}")  # Debug log
        
        # Create order
        order = Order(
            customer_id=current_user.id,
            total_amount=Decimal(str(total_amount)),
            payment_method='mpesa',
            status='pending',
            mpesa_phone_number=phone_number
        )
        
        db.session.add(order)
        db.session.flush()
        
        # Add order item
        order_item = OrderItem(
            order_id=order.id,
            product_id=product_id,
            quantity=quantity,
            price=Decimal(str(product.price))
        )
        db.session.add(order_item)
        
        # Calculate totals
        order.calculate_totals()
        
        # Initiate M-Pesa STK Push
        mpesa_service = MpesaService()
        account_reference = f"CHAT{order.id}"
        transaction_desc = f"Order #{order.id} - {product.name}"
        
        # Convert amount to integer for M-Pesa
        mpesa_amount = int(float(total_amount))
        
        print(f"Sending STK Push to: {phone_number}, Amount: {mpesa_amount}")  # Debug log
        
        stk_response, error = mpesa_service.stk_push(
            phone_number=phone_number,
            amount=mpesa_amount,
            account_reference=account_reference,
            transaction_desc=transaction_desc
        )
        
        if error:
            db.session.rollback()
            print(f"STK Push Error: {error}")  # Debug log
            return jsonify({
                "success": False, 
                "message": f"Payment processing failed: {error}"
            }), 400
        
        # Update order with M-Pesa details
        if stk_response:
            order.mpesa_merchant_request_id = stk_response.get('MerchantRequestID')
            order.mpesa_checkout_request_id = stk_response.get('CheckoutRequestID')
            order.mpesa_response_code = stk_response.get('ResponseCode')
            
            if stk_response.get('ResponseCode') == '0':
                order.status = 'processing'
        
        # Update product stock
        product.stock -= quantity
        
        # Commit everything
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": f"Order confirmed {current_user.first_name}! I've sent an M-Pesa prompt to {phone_number}. Please check your phone to complete payment.",
            "order": order.to_dict(),
            "stk_push_sent": True,
            "customer_name": f"{current_user.first_name}",
            "phone_number": phone_number
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error confirming chatbot order: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "message": f"Error processing your order: {str(e)}"
        }), 500

@chatbot_bp.route("/chatbot/suggest-products", methods=["GET"])
@token_required
def suggest_products(current_user):
    """Get available products for chatbot suggestions"""
    try:
        products = Product.query.filter(Product.stock > 0).limit(10).all()
        
        return jsonify({
            "success": True,
            "products": [{
                'id': p.id,
                'name': p.name,
                'price': str(p.price),
                'stock': p.stock,
                'category': p.category
            } for p in products]
        }), 200
        
    except Exception as e:
        print(f"Error getting product suggestions: {str(e)}")
        return jsonify({
            "success": False,
            "message": "Error fetching products"
        }), 500