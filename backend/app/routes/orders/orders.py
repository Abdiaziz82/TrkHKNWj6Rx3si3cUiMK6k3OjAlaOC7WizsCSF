from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models.Order import Order, OrderItem
from app.models.products import Product
from app.models.User import User
from app.services.mpesa_service import MpesaService
import jwt
from functools import wraps
from datetime import datetime
from decimal import Decimal

orders_bp = Blueprint("orders", __name__)

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

# ========== ROUTES ==========

# CORS Preflight Handler
@orders_bp.route("/orders", methods=["OPTIONS"])
@orders_bp.route("/orders/<int:id>", methods=["OPTIONS"])
@orders_bp.route("/orders/mpesa-stk-push", methods=["OPTIONS"])
def handle_options(id=None):
    return "", 200

# Create order with M-Pesa STK Push
@orders_bp.route("/orders/mpesa-stk-push", methods=["POST"])
@token_required
def create_order_with_mpesa(current_user):
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400
        
        required_fields = ['phone_number', 'amount', 'items']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "message": f"Missing required field: {field}"}), 400

        phone_number = data['phone_number']
        amount = data['amount']
        items = data['items']

        # Validate phone number format
        if not phone_number.startswith('254') and phone_number.startswith('0'):
            phone_number = '254' + phone_number[1:]
        elif not phone_number.startswith('254'):
            phone_number = '254' + phone_number

        # Create order first - ensure amount is Decimal
        order = Order(
            customer_id=current_user.id,
            total_amount=Decimal(str(amount)),
            payment_method='mpesa',
            status='pending',
            mpesa_phone_number=phone_number
        )
        
        db.session.add(order)
        db.session.flush()  # Get the order ID without committing

        # Add order items - ensure prices are Decimal
        for item_data in items:
            product = Product.query.get(item_data['product_id'])
            if not product:
                return jsonify({"success": False, "message": f"Product not found: {item_data['product_id']}"}), 404
            
            # Check stock availability
            if product.stock < item_data['quantity']:
                return jsonify({"success": False, "message": f"Insufficient stock for {product.name}"}), 400
            
            # Ensure price is converted to Decimal
            item_price = Decimal(str(item_data['price']))
            
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_data['product_id'],
                quantity=item_data['quantity'],
                price=item_price
            )
            db.session.add(order_item)

        # Calculate totals
        order.calculate_totals()

        # Initiate M-Pesa STK Push
        mpesa_service = MpesaService()
        account_reference = f"ORDER{order.id}"
        transaction_desc = f"Payment for order #{order.id}"
        
        # Convert amount to integer for M-Pesa (they expect whole numbers)
        mpesa_amount = int(float(amount))
        
        stk_response, error = mpesa_service.stk_push(
            phone_number=phone_number,
            amount=mpesa_amount,
            account_reference=account_reference,
            transaction_desc=transaction_desc
        )

        if error:
            db.session.rollback()
            return jsonify({"success": False, "message": f"M-Pesa STK Push failed: {error}"}), 400

        # Update order with M-Pesa response details
        if stk_response:
            order.mpesa_merchant_request_id = stk_response.get('MerchantRequestID')
            order.mpesa_checkout_request_id = stk_response.get('CheckoutRequestID')
            order.mpesa_response_code = stk_response.get('ResponseCode')
            
            # If STK Push was initiated successfully, mark as processing
            if stk_response.get('ResponseCode') == '0':
                order.status = 'processing'

        # Commit the order and M-Pesa details
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Order created and M-Pesa STK Push initiated successfully",
            "order": order.to_dict(),
            "mpesa_response": stk_response
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error creating order with M-Pesa: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "message": str(e)}), 500

# Create order with cash on delivery
@orders_bp.route("/orders/cash-on-delivery", methods=["POST"])
@token_required
def create_order_cash_on_delivery(current_user):
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400
        
        if 'items' not in data:
            return jsonify({"success": False, "message": "Missing required field: items"}), 400

        items = data['items']
        amount = data.get('amount', 0)

        # Create order - ensure amount is Decimal
        order = Order(
            customer_id=current_user.id,
            total_amount=Decimal(str(amount)),
            payment_method='cash_on_delivery',
            status='pending'
        )
        
        db.session.add(order)
        db.session.flush()

        # Add order items - ensure prices are Decimal
        for item_data in items:
            product = Product.query.get(item_data['product_id'])
            if not product:
                return jsonify({"success": False, "message": f"Product not found: {item_data['product_id']}"}), 404
            
            # Check stock availability
            if product.stock < item_data['quantity']:
                return jsonify({"success": False, "message": f"Insufficient stock for {product.name}"}), 400
            
            # Ensure price is converted to Decimal
            item_price = Decimal(str(item_data['price']))
            
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_data['product_id'],
                quantity=item_data['quantity'],
                price=item_price
            )
            db.session.add(order_item)

        # Calculate totals
        order.calculate_totals()
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Order created successfully (Cash on Delivery)",
            "order": order.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error creating cash order: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "message": str(e)}), 500

# Get user orders
@orders_bp.route("/orders", methods=["GET"])
@token_required
def get_user_orders(current_user):
    try:
        orders = Order.query.filter_by(customer_id=current_user.id)\
                          .order_by(Order.created_at.desc())\
                          .all()
        
        return jsonify({
            "success": True,
            "orders": [order.to_dict() for order in orders]
        }), 200

    except Exception as e:
        print(f"Error fetching orders: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# Get single order
@orders_bp.route("/orders/<int:order_id>", methods=["GET"])
@token_required
def get_order(current_user, order_id):
    try:
        order = Order.query.filter_by(id=order_id, customer_id=current_user.id).first()
        
        if not order:
            return jsonify({"success": False, "message": "Order not found"}), 404

        return jsonify({
            "success": True,
            "order": order.to_dict()
        }), 200

    except Exception as e:
        print(f"Error fetching order: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500
    
# Get all orders for admin
@orders_bp.route("/admin/orders", methods=["GET"])
@token_required
def get_all_orders(current_user):
    try:
        # Check if user is admin (you might want to add an admin field to your User model)
        if not current_user.role =="admin":  # You'll need to add this field to your User model
            return jsonify({"success": False, "message": "Unauthorized"}), 403

        orders = Order.query.order_by(Order.created_at.desc()).all()
        
        return jsonify({
            "success": True,
            "orders": [order.to_dict() for order in orders]
        }), 200

    except Exception as e:
        print(f"Error fetching all orders: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# Update order status
@orders_bp.route("/admin/orders/<int:order_id>/status", methods=["PUT"])
@token_required
def update_order_status(current_user, order_id):
    try:
        if not current_user.role=="admin":
            return jsonify({"success": False, "message": "Unauthorized"}), 403

        data = request.get_json()
        if not data or 'status' not in data:
            return jsonify({"success": False, "message": "Status is required"}), 400

        order = Order.query.get(order_id)
        if not order:
            return jsonify({"success": False, "message": "Order not found"}), 404

        valid_statuses = ['pending', 'processing', 'completed', 'shipped', 'cancelled']
        new_status = data['status']
        
        if new_status not in valid_statuses:
            return jsonify({"success": False, "message": "Invalid status"}), 400

        order.status = new_status
        db.session.commit()

        return jsonify({
            "success": True,
            "message": f"Order status updated to {new_status}",
            "order": order.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating order status: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# Update order details
@orders_bp.route("/admin/orders/<int:order_id>", methods=["PUT"])
@token_required
def update_order(current_user, order_id):
    try:
        if not current_user.role=="admin":
            return jsonify({"success": False, "message": "Unauthorized"}), 403

        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400

        order = Order.query.get(order_id)
        if not order:
            return jsonify({"success": False, "message": "Order not found"}), 404

        # Update allowed fields
        allowed_fields = ['status', 'mpesa_phone_number', 'payment_method']
        for field in allowed_fields:
            if field in data:
                setattr(order, field, data[field])

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Order updated successfully",
            "order": order.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating order: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500