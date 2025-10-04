from datetime import datetime
from app import db

class Conversation(db.Model):
    __tablename__ = 'conversations'
    id = db.Column(db.Integer, primary_key=True)
    retailer_id = db.Column(db.String(50), nullable=False)
    retailer_name = db.Column(db.String(100))
    retailer_avatar = db.Column(db.String(10))
    customer_id = db.Column(db.String(50), nullable=False)
    customer_name = db.Column(db.String(100))
    customer_avatar = db.Column(db.String(10))
    last_message = db.Column(db.Text)
    unread_count = db.Column(db.Integer, default=0)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    messages = db.relationship('Message', backref='conversation', lazy=True)

class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id'), nullable=False)
    sender_id = db.Column(db.String(50), nullable=False)
    sender_type = db.Column(db.String(20), nullable=False)  # 'retailer' or 'customer'
    content = db.Column(db.Text, nullable=False)
    message_type = db.Column(db.String(20), default='text')  # 'text', 'image', 'file', etc.
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
