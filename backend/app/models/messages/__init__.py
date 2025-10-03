# app/models/messages/__init__.py
from app.models.messages.messages import Conversation, Message

# Remove QuickReply from imports since it doesn't exist in your models
__all__ = ['Conversation', 'Message']