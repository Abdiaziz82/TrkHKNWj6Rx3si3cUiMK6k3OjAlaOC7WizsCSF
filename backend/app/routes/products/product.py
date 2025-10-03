from flask import Blueprint, request, jsonify
from app import db
from app.models.products import Product
from app.models.User import User
from functools import wraps
from app.routes.auth.login import token_required

products_bp = Blueprint("products_bp", __name__, url_prefix="/products")

# ---- Admin Required Decorator ----
def admin_required(f):
    @wraps(f)
    @token_required
    def decorated(current_user, *args, **kwargs):
        if current_user.role != "admin":
            return jsonify({"success": False, "message": "Admin access required"}), 403
        return f(*args, **kwargs)  # Remove current_user from here
    return decorated


# ---- Create Product ----
@products_bp.route("/", methods=["POST"])
@admin_required
def create_product():  # Remove current_user parameter
    data = request.get_json()
    try:
        product = Product(
            name=data["name"],
            sku=data["sku"],
            description=data.get("description"),
            unit=data["unit"],
            price=data["price"],
            stock=data.get("stock", 0),
            threshold=data.get("threshold", 0),
            expiry_date=data.get("expiry_date"),
        )
        db.session.add(product)
        db.session.commit()
        return jsonify({
            "success": True,
            "message": "Product created",
            "product": product.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 400


# ---- Get All Products ----
@products_bp.route("/", methods=["GET"])
@admin_required
def get_products():  # Remove current_user parameter
    products = Product.query.all()
    return jsonify({
        "success": True,
        "products": [p.to_dict() for p in products]
    }), 200


# ---- Get Single Product ----
@products_bp.route("/<int:id>", methods=["GET"])
@admin_required
def get_product(id):  # Remove current_user parameter
    product = Product.query.get(id)
    if not product:
        return jsonify({"success": False, "message": "Product not found"}), 404
    return jsonify({"success": True, "product": product.to_dict()}), 200


# ---- Update Product ----
@products_bp.route("/<int:id>", methods=["PUT"])
@admin_required
def update_product(id):  # Remove current_user parameter
    product = Product.query.get(id)
    if not product:
        return jsonify({"success": False, "message": "Product not found"}), 404

    data = request.get_json()
    try:
        product.name = data.get("name", product.name)
        product.sku = data.get("sku", product.sku)
        product.description = data.get("description", product.description)
        product.unit = data.get("unit", product.unit)
        product.price = data.get("price", product.price)
        product.stock = data.get("stock", product.stock)
        product.threshold = data.get("threshold", product.threshold)
        product.expiry_date = data.get("expiry_date", product.expiry_date)

        db.session.commit()
        return jsonify({
            "success": True,
            "message": "Product updated",
            "product": product.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 400


# ---- Delete Product ----
@products_bp.route("/<int:id>", methods=["DELETE"])
@admin_required
def delete_product(id):  # Remove current_user parameter
    product = Product.query.get(id)
    if not product:
        return jsonify({"success": False, "message": "Product not found"}), 404

    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({"success": True, "message": "Product deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 400
