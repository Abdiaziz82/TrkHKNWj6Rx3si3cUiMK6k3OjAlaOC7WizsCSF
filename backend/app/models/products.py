from app import db
from datetime import datetime, date
import os

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(120), nullable=False)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    unit = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False, default=0)
    threshold = db.Column(db.Integer, nullable=False, default=0)
    expiry_date = db.Column(db.Date, nullable=True)
    image_filename = db.Column(db.String(255), nullable=True)  # New field for image
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "sku": self.sku,
            "description": self.description,
            "unit": self.unit,
            "price": str(self.price),  # convert Decimal to string
            "stock": self.stock,
            "threshold": self.threshold,
            "expiry_date": self.expiry_date.isoformat() if self.expiry_date else None,
            "image_filename": self.image_filename,
            "image_url": self.get_image_url() if self.image_filename else None,
            "created_at": self.created_at.isoformat(),
        }

    def get_image_url(self):
        """Generate the full URL for the product image"""
        if self.image_filename:
            return f"/static/uploads/products/{self.image_filename}"
        return None

    def delete_image_file(self):
        """Delete the physical image file when product is deleted or image is updated"""
        if self.image_filename:
            try:
                from app import create_app
                app = create_app()
                image_path = os.path.join(app.config['UPLOAD_FOLDER'], self.image_filename)
                if os.path.exists(image_path):
                    os.remove(image_path)
            except Exception as e:
                print(f"Error deleting image file: {e}")