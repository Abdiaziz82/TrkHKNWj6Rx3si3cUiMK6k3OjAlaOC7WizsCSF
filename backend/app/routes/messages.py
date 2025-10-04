from flask import Blueprint, request, jsonify
from app.models.messages import Conversation, Message
from app import db
from datetime import datetime

messages_bp = Blueprint('messages', __name__, url_prefix='/api/messages')


# Get all conversations for a user
@messages_bp.route('/conversations', methods=['GET'])
def get_conversations():
    user_id = request.args.get('user_id')
    user_type = request.args.get('user_type')

    if not user_id or not user_type:
        return jsonify({"success": False, "error": "Missing user_id or user_type"}), 400

    if user_type == 'retailer':
        convs = Conversation.query.filter_by(retailer_id=user_id).order_by(Conversation.timestamp.desc()).all()
    else:
        convs = Conversation.query.filter_by(customer_id=user_id).order_by(Conversation.timestamp.desc()).all()

    result = []
    for c in convs:
        result.append({
            "id": c.id,
            "retailer_id": c.retailer_id,
            "retailer_name": c.retailer_name,
            "retailer_avatar": c.retailer_avatar,
            "customer_id": c.customer_id,
            "customer_name": c.customer_name,
            "customer_avatar": c.customer_avatar,
            "last_message": c.last_message,
            "unread_count": c.unread_count,
            "timestamp": c.timestamp
        })
    return jsonify(result)


# Get messages in a conversation
@messages_bp.route('/conversations/<int:conversation_id>', methods=['GET'])
def get_conversation_messages(conversation_id):
    conversation = Conversation.query.get(conversation_id)
    if not conversation:
        return jsonify({"success": False, "error": "Conversation not found"}), 404

    messages = Message.query.filter_by(conversation_id=conversation_id).order_by(Message.timestamp.asc()).all()
    result = []
    for m in messages:
        result.append({
            "id": m.id,
            "sender_id": m.sender_id,
            "sender_type": m.sender_type,
            "content": m.content,
            "message_type": m.message_type,
            "timestamp": m.timestamp
        })
    return jsonify(result)


# Start a new conversation
@messages_bp.route('/conversations', methods=['POST'])
def create_conversation():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "Request must be JSON"}), 415

    try:
        conv = Conversation(
            retailer_id=data['retailer_id'],
            retailer_name=data.get('retailer_name', ''),
            retailer_avatar=data.get('retailer_avatar', ''),
            customer_id=data['customer_id'],
            customer_name=data.get('customer_name', ''),
            customer_avatar=data.get('customer_avatar', ''),
            last_message=data.get('last_message', 'Conversation started'),
            unread_count=0,
            timestamp=datetime.utcnow()
        )
        db.session.add(conv)
        db.session.commit()
        return jsonify({"success": True, "conversation_id": conv.id}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


# Send a message
@messages_bp.route('/messages', methods=['POST'])
def send_message():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "Request must be JSON"}), 415

    try:
        msg = Message(
            conversation_id=data['conversation_id'],
            sender_id=data['sender_id'],
            sender_type=data['sender_type'],
            content=data['content'],
            message_type=data.get('message_type', 'text'),
            timestamp=datetime.utcnow()
        )
        db.session.add(msg)

        # Update conversation last message and timestamp
        conv = Conversation.query.get(data['conversation_id'])
        if conv:
            conv.last_message = data['content']
            conv.timestamp = datetime.utcnow()
            db.session.commit()

        return jsonify({"success": True, "message_id": msg.id}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
