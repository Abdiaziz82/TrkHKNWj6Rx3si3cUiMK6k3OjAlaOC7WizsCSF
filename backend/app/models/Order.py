from app import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_name = db.Column(db.String(120), nullable=False)  # wholesaler writes manually
    customer_phone = db.Column(db.String(20), nullable=True)
    product_name = db.Column(db.String(120), nullable=False)  # from Products or free-text
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    order_method = db.Column(db.String(20), default="manual")  # "manual" or "chatbot"
    status = db.Column(db.String(20), default="pending")       # pending, approved, delivered
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "customer_name": self.customer_name,
            "customer_phone": self.customer_phone,
            "product_name": self.product_name,
            "quantity": self.quantity,
            "unit_price": str(self.unit_price),
            "total_price": str(self.total_price),
            "order_method": self.order_method,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }
