from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models.products import Product
from app.models.User import User
import jwt
from functools import wraps
from datetime import datetime, date
import pandas as pd
import io
import os
from werkzeug.utils import secure_filename

products_bp = Blueprint("products", __name__)

# JWT configuration (should match login.py)
JWT_SECRET_KEY = "super-secret-jwt"
JWT_ALGORITHM = "HS256"

# ========== HELPER FUNCTIONS ==========
def allowed_file(filename):
    """Check if the file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def save_product_image(file, sku):
    """Save product image with SKU-based filename"""
    if file and allowed_file(file.filename):
        # Get file extension
        file_ext = file.filename.rsplit('.', 1)[1].lower()
        # Create filename using SKU and timestamp to avoid conflicts
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{sku}_{timestamp}.{file_ext}"
        filename = secure_filename(filename)
        
        # Save file
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return filename
    return None

def delete_product_image(filename):
    """Delete product image file"""
    if filename:
        try:
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error deleting image file: {e}")

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
@products_bp.route("/products/bulk-upload", methods=["OPTIONS"])
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

# CREATE product (Admin only) - ULTIMATE VERSION
@products_bp.route("/products", methods=["POST"])
@admin_required
def create_product(current_user):
    try:
        print("=== CREATE PRODUCT REQUEST ===")
        print("Content-Type:", request.content_type)
        print("Files:", dict(request.files))
        print("Form:", dict(request.form))
        
        # Always try to get data from form first (for file uploads)
        data = request.form.to_dict()
        file = request.files.get('image')
        
        # If no form data, try JSON
        if not data and request.is_json:
            data = request.get_json()
        elif not data:
            # Try to get JSON anyway as fallback
            data = request.get_json(silent=True) or {}
        
        print("Parsed data:", data)
        print("Image file:", file.filename if file else None)

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

        # Handle image upload
        image_filename = None
        if file and file.filename:
            print(f"Saving image: {file.filename}")
            image_filename = save_product_image(file, data["sku"])
            print(f"Image saved as: {image_filename}")

        # Create new product - ensure proper data types
        product = Product(
            name=str(data["name"]),
            sku=str(data["sku"]),
            description=str(data.get("description", "")),
            unit=str(data.get("unit", "kg")),
            price=float(data.get("price", 0)),
            stock=int(data.get("stock", 0)),
            threshold=int(data.get("threshold", 0)),
            expiry_date=expiry_date,
            image_filename=image_filename
        )
        
        db.session.add(product)
        db.session.commit()

        print("Product created successfully!")
        return jsonify({
            "success": True, 
            "message": "Product created successfully", 
            "product": product.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating product: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "message": str(e)}), 500

# BULK UPLOAD products from Excel/CSV (Admin only)
@products_bp.route("/products/bulk-upload", methods=["POST"])
@admin_required
def bulk_upload_products(current_user):
    try:
        if 'file' not in request.files:
            return jsonify({"success": False, "message": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"success": False, "message": "No file selected"}), 400

        # Check file extension
        allowed_extensions = {'csv', 'xlsx', 'xls'}
        file_extension = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        
        if file_extension not in allowed_extensions:
            return jsonify({"success": False, "message": "Invalid file type. Please upload CSV or Excel file."}), 400

        # Read file based on extension
        if file_extension == 'csv':
            df = pd.read_csv(file)
        else:  # Excel files
            df = pd.read_excel(file)

        # Validate required columns
        required_columns = ['name', 'sku', 'unit', 'price', 'stock', 'threshold']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            return jsonify({
                "success": False, 
                "message": f"Missing required columns: {', '.join(missing_columns)}"
            }), 400

        success_count = 0
        error_count = 0
        errors = []

        # Process each row
        for index, row in df.iterrows():
            try:
                # Skip empty rows
                if pd.isna(row.get('name')) or pd.isna(row.get('sku')):
                    continue

                # Check if SKU already exists
                existing_product = Product.query.filter_by(sku=str(row['sku'])).first()
                if existing_product:
                    errors.append(f"Row {index + 2}: SKU '{row['sku']}' already exists")
                    error_count += 1
                    continue

                # Parse data with defaults
                name = str(row['name']).strip()
                sku = str(row['sku']).strip()
                description = str(row['description']).strip() if 'description' in row and pd.notna(row['description']) else ""
                unit = str(row['unit']).strip() if 'unit' in row and pd.notna(row['unit']) else "kg"
                price = float(row['price']) if pd.notna(row['price']) else 0.0
                stock = int(row['stock']) if pd.notna(row['stock']) else 0
                threshold = int(row['threshold']) if pd.notna(row['threshold']) else 0
                
                # Handle expiry date
                expiry_date = None
                if 'expiry_date' in row and pd.notna(row['expiry_date']):
                    try:
                        if isinstance(row['expiry_date'], str):
                            expiry_date = parse_date(row['expiry_date'])
                        else:
                            # Handle Excel date format
                            expiry_date = row['expiry_date'].date() if hasattr(row['expiry_date'], 'date') else None
                    except:
                        expiry_date = None

                # Create product (without image for bulk upload)
                product = Product(
                    name=name,
                    sku=sku,
                    description=description,
                    unit=unit,
                    price=price,
                    stock=stock,
                    threshold=threshold,
                    expiry_date=expiry_date
                    # image_filename is not set in bulk upload
                )
                
                db.session.add(product)
                success_count += 1

            except Exception as e:
                errors.append(f"Row {index + 2}: {str(e)}")
                error_count += 1
                continue

        # Commit all successful products
        if success_count > 0:
            db.session.commit()

        return jsonify({
            "success": True,
            "message": f"Bulk upload completed. Success: {success_count}, Errors: {error_count}",
            "success_count": success_count,
            "error_count": error_count,
            "errors": errors
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": f"File processing error: {str(e)}"}), 500
    
# UPDATE product (Admin only) - UPDATED FOR IMAGE UPLOAD
@products_bp.route("/products/<int:id>", methods=["PUT"])
@admin_required
def update_product(current_user, id):
    try:
        product = Product.query.get(id)
        if not product:
            return jsonify({"success": False, "message": "Product not found"}), 404

        print("=== UPDATE PRODUCT REQUEST ===")
        print("Content-Type:", request.content_type)
        print("Files:", dict(request.files))
        print("Form:", dict(request.form))
        
        # Always try to get data from form first (for file uploads)
        data = request.form.to_dict()
        file = request.files.get('image')
        
        # If no form data, try JSON
        if not data and request.is_json:
            data = request.get_json()
        elif not data:
            # Try to get JSON anyway as fallback
            data = request.get_json(silent=True) or {}
        
        print("Parsed data:", data)
        print("Image file:", file.filename if file else None)

        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400

        # Check if SKU is being changed and if it already exists
        if "sku" in data and data["sku"] != product.sku:
            existing_product = Product.query.filter_by(sku=data["sku"]).first()
            if existing_product:
                return jsonify({"success": False, "message": "Product with this SKU already exists"}), 400

        # Handle image upload/update
        if file and file.filename:
            # Delete old image if exists
            if product.image_filename:
                delete_product_image(product.image_filename)
            # Save new image
            image_filename = save_product_image(file, data.get("sku", product.sku))
            product.image_filename = image_filename
        elif data.get('remove_image') == 'true':
            # Remove existing image
            if product.image_filename:
                delete_product_image(product.image_filename)
                product.image_filename = None

        # Update product fields
        if "name" in data:
            product.name = str(data["name"])
        if "sku" in data:
            product.sku = str(data["sku"])
        if "description" in data:
            product.description = str(data["description"])
        if "unit" in data:
            product.unit = str(data["unit"])
        if "price" in data:
            product.price = float(data["price"])
        if "stock" in data:
            product.stock = int(data["stock"])
        if "threshold" in data:
            product.threshold = int(data["threshold"])
        
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
        print(f"Error updating product: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500
    
# DELETE product (Admin only) - UPDATED TO DELETE IMAGE FILE
@products_bp.route("/products/<int:id>", methods=["DELETE"])
@admin_required
def delete_product(current_user, id):
    try:
        product = Product.query.get(id)
        if not product:
            return jsonify({"success": False, "message": "Product not found"}), 404

        # Delete associated image file
        if product.image_filename:
            delete_product_image(product.image_filename)

        db.session.delete(product)
        db.session.commit()
        
        return jsonify({
            "success": True, 
            "message": "Product deleted successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500