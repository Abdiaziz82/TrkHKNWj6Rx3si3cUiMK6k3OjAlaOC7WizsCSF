# app/routes/messages/messages.py
from flask import Blueprint, request, jsonify
from app import db
# FIXED IMPORT PATH - import from the correct nested location
from app.models.messages.messages import Conversation, Message
from datetime import datetime

messages_bp = Blueprint('messages', __name__, url_prefix='/api/messages')

# Get conversations for a user (retailer or customer)
@messages_bp.route('/conversations', methods=['GET'])
def get_conversations():
    user_id = request.args.get('user_id')
    user_type = request.args.get('user_type')
    
    if not user_id or not user_type:
        return jsonify({'success': False, 'error': 'Missing user_id or user_type'}), 400
    
    try:
        if user_type == 'retailer':
            conversations = Conversation.query.filter_by(retailer_id=user_id).order_by(Conversation.timestamp.desc()).all()
        else:
            conversations = Conversation.query.filter_by(customer_id=user_id).order_by(Conversation.timestamp.desc()).all()
        
        data = []
        for conv in conversations:
            data.append({
                'id': conv.id,
                'retailer_id': conv.retailer_id,
                'retailer_name': conv.retailer_name,
                'retailer_avatar': conv.retailer_avatar,
                'customer_id': conv.customer_id,
                'customer_name': conv.customer_name,
                'customer_avatar': conv.customer_avatar,
                'last_message': conv.last_message,
                'timestamp': conv.timestamp.isoformat(),
                'unread_count': conv.unread_count
            })
        
        return jsonify({'success': True, 'data': data})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get specific conversation with messages
@messages_bp.route('/conversations/<int:conversation_id>', methods=['GET'])
def get_conversation(conversation_id):
    try:
        conversation = Conversation.query.get_or_404(conversation_id)
        
        # Mark messages as read when fetching conversation
        user_id = request.args.get('user_id')
        if user_id:
            # Mark only the other party's messages as read
            Message.query.filter(
                Message.conversation_id == conversation_id,
                Message.sender_id != user_id,
                Message.read == False
            ).update({'read': True})
            
            # Update unread count
            conversation.unread_count = Message.query.filter(
                Message.conversation_id == conversation_id,
                Message.sender_id != user_id,
                Message.read == False
            ).count()
            
            db.session.commit()
        
        messages = Message.query.filter_by(conversation_id=conversation.id).order_by(Message.timestamp.asc()).all()
        messages = [msg.to_dict() for msg in messages]

        
        data = {
            'id': conversation.id,
            'retailer_id': conversation.retailer_id,
            'retailer_name': conversation.retailer_name,
            'retailer_avatar': conversation.retailer_avatar,
            'customer_id': conversation.customer_id,
            'customer_name': conversation.customer_name,
            'customer_avatar': conversation.customer_avatar,
            'last_message': conversation.last_message,
            'timestamp': conversation.timestamp.isoformat(),
            'unread_count': conversation.unread_count,
            'messages': messages
        }
        
        return jsonify({'success': True, 'data': data})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Create new conversation
@messages_bp.route('/conversations', methods=['POST'])
def create_conversation():
    try:
        data = request.get_json()
        
        # Check if conversation already exists
        existing_conv = Conversation.query.filter_by(
            retailer_id=data['retailer_id'],
            customer_id=data['customer_id']
        ).first()
        
        if existing_conv:
            return jsonify({'success': True, 'data': {'conversation_id': existing_conv.id}})
        
        conversation = Conversation(
            retailer_id=data['retailer_id'],
            retailer_name=data['retailer_name'],
            retailer_avatar=data.get('retailer_avatar', data['retailer_name'][:2].upper()),
            customer_id=data['customer_id'],
            customer_name=data['customer_name'],
            customer_avatar=data.get('customer_avatar', data['customer_name'][:2].upper()),
            last_message="Conversation started"
        )
        
        db.session.add(conversation)
        db.session.commit()
        
        return jsonify({'success': True, 'data': {'conversation_id': conversation.id}})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Send message
@messages_bp.route('/conversations/<int:conversation_id>/messages', methods=['POST'])
def send_message(conversation_id):
    try:
        data = request.get_json()
        
        conversation = Conversation.query.get(conversation_id)
        if not conversation:
            return jsonify({'success': False, 'error': 'Conversation not found'}), 404
        
        message = Message(
            conversation_id=conversation_id,
            sender_id=data['sender_id'],
            sender_type=data['sender_type'],
            content=data['content'],
            message_type=data.get('message_type', 'text')
        )
        
        # Update conversation
        conversation.last_message = data['content']
        conversation.timestamp = datetime.utcnow()
        
        # Increment unread count for the other party
        conversation.unread_count += 1
        
        db.session.add(message)
        db.session.commit()
        
        return jsonify({
            'success': True, 
            'data': message.to_dict(),
            'message': 'Message sent successfully'
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get unread count for user
@messages_bp.route('/unread_count', methods=['GET'])
def get_unread_count():
    user_id = request.args.get('user_id')
    user_type = request.args.get('user_type')
    
    if not user_id or not user_type:
        return jsonify({'success': False, 'error': 'Missing user_id or user_type'}), 400
    
    try:
        if user_type == 'retailer':
            total_unread = db.session.query(db.func.sum(Conversation.unread_count)).filter(
                Conversation.retailer_id == user_id
            ).scalar() or 0
        else:
            total_unread = db.session.query(db.func.sum(Conversation.unread_count)).filter(
                Conversation.customer_id == user_id
            ).scalar() or 0
        
        return jsonify({'success': True, 'data': {'unread_count': total_unread}})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500