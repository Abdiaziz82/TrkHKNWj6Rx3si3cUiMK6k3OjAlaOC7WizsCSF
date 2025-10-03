from flask import Blueprint, request, jsonify
from app import db
from app.models.products import Product
from app.models.User import User
import jwt
from functools import wraps
from datetime import datetime, date

products_bp = Blueprint("products", __name__)

# JWT configuration (should match login.py)
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

# ========== ADMIN DECORATOR ==========
def admin_required(f):
    @wraps(f)
    @token_required
    def decorated(current_user, *args, **kwargs):
        if current_user.role != "admin":
            return jsonify({"success": False, "message": "Admin access required"}), 403
        return f(current_user, *args, **kwargs)

    return decorated

# ========== HELPER FUNCTIONS ==========
def parse_date(date_string):
    """Convert string to date object, return None if empty/invalid"""
    if not date_string:
        return None
    try:
        return datetime.strptime(date_string, '%Y-%m-%d').date()
    except (ValueError, TypeError):
        return None

# ========== ROUTES ==========

# CORS Preflight Handler
@products_bp.route("/products", methods=["OPTIONS"])
@products_bp.route("/products/<int:id>", methods=["OPTIONS"])
def handle_options(id=None):
    return "", 200

# GET all products
@products_bp.route("/products", methods=["GET"])
@token_required
def get_products(current_user):
    try:
        products = Product.query.order_by(Product.created_at.desc()).all()
        return jsonify({
            "success": True,
            "products": [p.to_dict() for p in products]
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# CREATE product (Admin only)
@products_bp.route("/products", methods=["POST"])

@admin_required
def create_product(current_user):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400

        # Validate required fields
        if not data.get("name") or not data.get("sku"):
            return jsonify({"success": False, "message": "Product name and SKU are required"}), 400

        # Check if SKU already exists
        existing_product = Product.query.filter_by(sku=data["sku"]).first()
        if existing_product:
            return jsonify({"success": False, "message": "Product with this SKU already exists"}), 400

        # Parse expiry_date from string to date object
        expiry_date = parse_date(data.get("expiry_date"))

        # Create new product
        product = Product(
            name=data["name"],
            sku=data["sku"],
            description=data.get("description", ""),
            unit=data.get("unit", "kg"),
            price=float(data.get("price", 0)),
            stock=int(data.get("stock", 0)),
            threshold=int(data.get("threshold", 0)),
            expiry_date=expiry_date
        )
        
        db.session.add(product)
        db.session.commit()

        return jsonify({
            "success": True, 
            "message": "Product created successfully", 
            "product": product.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

# UPDATE product (Admin only)
@products_bp.route("/products/<int:id>", methods=["PUT"])

@admin_required
def update_product(current_user, id):
    try:
        product = Product.query.get(id)
        if not product:
            return jsonify({"success": False, "message": "Product not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400

        # Check if SKU is being changed and if it already exists
        if "sku" in data and data["sku"] != product.sku:
            existing_product = Product.query.filter_by(sku=data["sku"]).first()
            if existing_product:
                return jsonify({"success": False, "message": "Product with this SKU already exists"}), 400

        # Update product fields
        product.name = data.get("name", product.name)
        if "sku" in data:
            product.sku = data["sku"]
        product.description = data.get("description", product.description)
        product.unit = data.get("unit", product.unit)
        product.price = float(data.get("price", product.price))
        product.stock = int(data.get("stock", product.stock))
        product.threshold = int(data.get("threshold", product.threshold))
        
        # Handle expiry_date conversion
        if "expiry_date" in data:
            product.expiry_date = parse_date(data["expiry_date"])

        db.session.commit()

        return jsonify({
            "success": True, 
            "message": "Product updated successfully", 
            "product": product.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

# DELETE product (Admin only)
@products_bp.route("/products/<int:id>", methods=["DELETE"])
@token_required
@admin_required
def delete_product(current_user, id):
    try:
        product = Product.query.get(id)
        if not product:
            return jsonify({"success": False, "message": "Product not found"}), 404

        db.session.delete(product)
        db.session.commit()
        
        return jsonify({
            "success": True, 
            "message": "Product deleted successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500