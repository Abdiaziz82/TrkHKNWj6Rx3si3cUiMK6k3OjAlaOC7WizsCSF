from app import db
from datetime import datetime
from decimal import Decimal

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    total_quantity = db.Column(db.Integer, nullable=False, default=0)
    payment_method = db.Column(db.String(50), nullable=False, default="mpesa")
    status = db.Column(db.String(50), nullable=False, default="pending")
    
    # M-Pesa specific fields
    mpesa_phone_number = db.Column(db.String(20), nullable=True)
    mpesa_checkout_request_id = db.Column(db.String(100), nullable=True)
    mpesa_merchant_request_id = db.Column(db.String(100), nullable=True)
    mpesa_response_code = db.Column(db.String(10), nullable=True)
    mpesa_result_code = db.Column(db.String(10), nullable=True)
    mpesa_result_desc = db.Column(db.String(255), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    customer = db.relationship("User", backref=db.backref("orders", lazy=True))
    items = db.relationship("OrderItem", backref="order", cascade="all, delete-orphan", lazy=True)

    def calculate_totals(self):
        """Recalculate the order total and quantity based on items"""
        total_amount = Decimal('0.00')
        total_quantity = 0
        
        for item in self.items:
            # Ensure price is converted to Decimal
            if isinstance(item.price, str):
                item_price = Decimal(item.price)
            else:
                item_price = Decimal(str(item.price))
                
            item_subtotal = item_price * item.quantity
            total_amount += item_subtotal
            total_quantity += item.quantity
        
        self.total_amount = total_amount
        self.total_quantity = total_quantity

    def to_dict(self):
        order_dict = {
            "id": self.id,
            "customer_id": self.customer_id,
            "total_amount": str(self.total_amount),
            "total_quantity": self.total_quantity,
            "payment_method": self.payment_method,
            "status": self.status,
            "mpesa_phone_number": self.mpesa_phone_number,
            "mpesa_checkout_request_id": self.mpesa_checkout_request_id,
            "mpesa_merchant_request_id": self.mpesa_merchant_request_id,
            "mpesa_response_code": self.mpesa_response_code,
            "created_at": self.created_at.isoformat(),
            "items": [item.to_dict() for item in self.items]
        }
        
        # Add customer information if available
        if self.customer:
            order_dict["customer_name"] = f"{self.customer.first_name} {self.customer.last_name}"
            order_dict["customer_email"] = self.customer.email
            order_dict["customer_phone"] = self.customer.phone_number
            order_dict["customer"] = {
                "first_name": self.customer.first_name,
                "last_name": self.customer.last_name,
                "email": self.customer.email,
                "phone_number": self.customer.phone_number
            }
        
        return order_dict


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price = db.Column(db.Numeric(10, 2), nullable=False)

    # Relationships
    product = db.relationship("Product", backref=db.backref("order_items", lazy=True))

    @property
    def subtotal(self):
        # Ensure price is converted to Decimal for calculation
        if isinstance(self.price, str):
            price_decimal = Decimal(self.price)
        else:
            price_decimal = Decimal(str(self.price))
        return price_decimal * self.quantity

    def to_dict(self):
        return {
            "id": self.id,
            "product": self.product.name if self.product else None,
            "quantity": self.quantity,
            "price": str(self.price),
            "subtotal": str(self.subtotal),
        }