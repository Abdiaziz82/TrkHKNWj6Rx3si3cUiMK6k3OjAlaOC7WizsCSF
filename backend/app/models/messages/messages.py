# app/models/messages/messages.py
from app import db
from datetime import datetime

class Conversation(db.Model):
    __tablename__ = 'conversations'
    
    id = db.Column(db.Integer, primary_key=True)
    retailer_id = db.Column(db.String(100), nullable=False)
    retailer_name = db.Column(db.String(100), nullable=False)
    retailer_avatar = db.Column(db.String(10))
    customer_id = db.Column(db.String(100), nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_avatar = db.Column(db.String(10))
    last_message = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    unread_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    messages = db.relationship('Message', backref='conversation', lazy=True, cascade='all, delete-orphan')

class Message(db.Model):
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id'), nullable=False)
    sender_id = db.Column(db.String(100), nullable=False)
    sender_type = db.Column(db.String(20), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    read = db.Column(db.Boolean, default=False)
    message_type = db.Column(db.String(20), default='text')
    
    def to_dict(self):
        return {
            'id': self.id,
            'conversation_id': self.conversation_id,
            'sender_id': self.sender_id,
            'sender_type': self.sender_type,
            'content': self.content,
            'timestamp': self.timestamp.isoformat(),
            'read': self.read,
            'message_type': self.message_type
        }