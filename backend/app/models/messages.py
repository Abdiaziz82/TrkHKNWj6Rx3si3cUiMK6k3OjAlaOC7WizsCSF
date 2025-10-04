# models/messages.py (Enhanced)
from app import db
from datetime import datetime

class Conversation(db.Model):
    __tablename__ = 'conversations'
    
    id = db.Column(db.Integer, primary_key=True)
    retailer_id = db.Column(db.String(100), nullable=False)
    retailer_name = db.Column(db.String(200), nullable=False)
    retailer_avatar = db.Column(db.String(10), default='R')
    customer_id = db.Column(db.String(100), nullable=False)
    customer_name = db.Column(db.String(200), nullable=False)
    customer_avatar = db.Column(db.String(10), default='C')
    last_message = db.Column(db.Text)
    unread_count = db.Column(db.Integer, default=0)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    messages = db.relationship('Message', backref='conversation', lazy=True, cascade='all, delete-orphan')

class Message(db.Model):
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id'), nullable=False)
    sender_id = db.Column(db.String(100), nullable=False)
    sender_type = db.Column(db.String(20), nullable=False)  # 'retailer', 'customer', 'ai'
    content = db.Column(db.Text, nullable=False)
    message_type = db.Column(db.String(20), default='text')  # 'text', 'image', 'file'
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    read = db.Column(db.Boolean, default=False)
    language = db.Column(db.String(10), default='english')  # 'english', 'swahili'
    
    __table_args__ = (
        db.Index('idx_conversation_timestamp', 'conversation_id', 'timestamp'),
        db.Index('idx_sender_read', 'sender_id', 'read'),
        db.Index('idx_message_language', 'language'),
    )

class SupportQA(db.Model):
    __tablename__ = 'support_qa'
    
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(10), default='english')  # 'english' or 'swahili'
    category = db.Column(db.String(50), default='general')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        db.Index('idx_qa_language_category', 'language', 'category'),
        db.Index('idx_qa_timestamp', 'timestamp'),
    )