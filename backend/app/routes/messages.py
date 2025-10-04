from flask import Blueprint, request, jsonify
from flask_socketio import emit, join_room, leave_room
from app import socketio
from datetime import datetime
import uuid

messages_bp = Blueprint('messages', __name__)

# Mock data storage (in-memory for testing)
conversations_store = {}
messages_store = {}
users_store = {
    'customer_1': {
        'id': 'customer_1',
        'name': 'Sarah Johnson',
        'avatar': 'SJ',
        'online': True,
        'user_type': 'customer'
    },
    'retailer_1': {
        'id': 'retailer_1',
        'name': 'Tech Store',
        'avatar': 'TS',
        'online': True,
        'user_type': 'retailer'
    },
    'ai_support': {
        'id': 'ai_support',
        'name': 'AI Assistant',
        'avatar': 'AI',
        'online': True,
        'user_type': 'ai'
    }
}

# Initialize with some mock data
conversations_store['conv_1'] = {
    'id': 'conv_1',
    'title': 'Tech Store',
    'participant_ids': ['customer_1', 'retailer_1'],
    'conversation_type': 'direct',
    'created_at': datetime.utcnow().isoformat(),
    'updated_at': datetime.utcnow().isoformat()
}

messages_store['conv_1'] = [
    {
        'id': 'msg_1',
        'conversation_id': 'conv_1',
        'sender_id': 'customer_1',
        'content': 'Hi, I have questions about investment strategies',
        'message_type': 'text',
        'status': 'read',
        'timestamp': datetime.utcnow().isoformat(),
        'sender': users_store['customer_1']
    },
    {
        'id': 'msg_2',
        'conversation_id': 'conv_1',
        'sender_id': 'ai_support',
        'content': 'Hello! I\'d be happy to help you with investment strategies. For beginners, I recommend starting with a diversified portfolio.',
        'message_type': 'text',
        'status': 'read',
        'timestamp': datetime.utcnow().isoformat(),
        'sender': users_store['ai_support']
    }
]

# Socket.IO event handlers
@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    emit('connected', {'status': 'connected', 'sid': request.sid})

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')

@socketio.on('join_conversation')
def handle_join_conversation(data):
    conversation_id = data.get('conversation_id')
    user_id = data.get('user_id')

    if conversation_id and user_id:
        join_room(conversation_id)
        print(f"User {user_id} joined conversation {conversation_id}")

        # Update user online status
        if user_id in users_store:
            users_store[user_id]['online'] = True
            users_store[user_id]['last_seen'] = datetime.utcnow().isoformat()

        emit('user_joined', {
            'user_id': user_id,
            'conversation_id': conversation_id,
            'timestamp': datetime.utcnow().isoformat()
        }, room=conversation_id)

@socketio.on('leave_conversation')
def handle_leave_conversation(data):
    conversation_id = data.get('conversation_id')
    user_id = data.get('user_id')

    if conversation_id:
        leave_room(conversation_id)
        print(f"User {user_id} left conversation {conversation_id}")

        if user_id:
            if user_id in users_store:
                users_store[user_id]['online'] = False
                users_store[user_id]['last_seen'] = datetime.utcnow().isoformat()

@socketio.on('typing_start')
def handle_typing_start(data):
    conversation_id = data.get('conversation_id')
    user_id = data.get('user_id')

    if conversation_id and user_id:
        emit('user_typing', {
            'user_id': user_id,
            'conversation_id': conversation_id,
            'is_typing': True,
            'timestamp': datetime.utcnow().isoformat()
        }, room=conversation_id)

@socketio.on('typing_stop')
def handle_typing_stop(data):
    conversation_id = data.get('conversation_id')
    user_id = data.get('user_id')

    if conversation_id and user_id:
        emit('user_typing', {
            'user_id': user_id,
            'conversation_id': conversation_id,
            'is_typing': False,
            'timestamp': datetime.utcnow().isoformat()
        }, room=conversation_id)

@socketio.on('send_message')
def handle_send_message(data):
    try:
        conversation_id = data.get('conversation_id')
        sender_id = data.get('sender_id')
        content = data.get('content')
        message_type = data.get('message_type', 'text')

        # Create new message
        new_message = {
            'id': f'msg_{uuid.uuid4().hex[:8]}',
            'conversation_id': conversation_id,
            'sender_id': sender_id,
            'content': content,
            'message_type': message_type,
            'status': 'sent',
            'timestamp': datetime.utcnow().isoformat(),
            'sender': users_store.get(sender_id, {
                'id': sender_id,
                'name': 'Unknown User',
                'avatar': 'UU'
            })
        }

        # Store message
        if conversation_id not in messages_store:
            messages_store[conversation_id] = []
        messages_store[conversation_id].append(new_message)

        # Update conversation
        if conversation_id in conversations_store:
            conversations_store[conversation_id]['updated_at'] = datetime.utcnow().isoformat()
            conversations_store[conversation_id]['last_message'] = content

        # Broadcast to conversation room
        emit('new_message', new_message, room=conversation_id)

    except Exception as e:
        print(f"Error sending message: {e}")
        emit('message_error', {
            'error': str(e),
            'conversation_id': data.get('conversation_id')
        })

# REST API Routes
@messages_bp.route('/conversations', methods=['GET'])
def get_conversations():
    user_id = request.args.get('user_id', 'customer_1')

    # Get conversations for the user
    user_conversations = []
    for conv_id, conv in conversations_store.items():
        if user_id in conv.get('participant_ids', []):
            # Get last message
            last_message = ''
            if conv_id in messages_store and messages_store[conv_id]:
                last_message = messages_store[conv_id][-1]['content']

            # Get other participant
            other_participant_id = next(
                (pid for pid in conv['participant_ids'] if pid != user_id),
                None
            )
            other_user = users_store.get(other_participant_id, {})

            user_conversations.append({
                'id': conv_id,
                'title': conv.get('title', other_user.get('name', 'Unknown')),
                'last_message': last_message,
                'timestamp': conv.get('updated_at', conv.get('created_at')),
                'unread_count': 0,  # Mock value
                'avatar': other_user.get('avatar', 'UU'),
                'online': other_user.get('online', False),
                'participant_name': other_user.get('name', 'Unknown'),
                'conversation_type': conv.get('conversation_type', 'direct')
            })

    return jsonify(user_conversations)

@messages_bp.route('/conversations', methods=['POST'])
def create_conversation():
    data = request.get_json()
    participant_ids = data.get('participant_ids', ['customer_1', 'retailer_1'])
    title = data.get('title', 'New Conversation')

    # Create new conversation
    new_conv_id = f'conv_{uuid.uuid4().hex[:8]}'
    new_conversation = {
        'id': new_conv_id,
        'title': title,
        'participant_ids': participant_ids,
        'conversation_type': 'direct' if len(participant_ids) == 2 else 'group',
        'created_at': datetime.utcnow().isoformat(),
        'updated_at': datetime.utcnow().isoformat()
    }

    conversations_store[new_conv_id] = new_conversation
    messages_store[new_conv_id] = []

    return jsonify({
        'message': 'Conversation created',
        'conversation_id': new_conv_id,
        'conversation': new_conversation
    }), 201

@messages_bp.route('/conversations/<conversation_id>/messages', methods=['GET'])
def get_messages(conversation_id):
    user_id = request.args.get('user_id', 'customer_1')

    messages = messages_store.get(conversation_id, [])

    return jsonify({
        'messages': messages,
        'total': len(messages),
        'pages': 1,
        'current_page': 1
    })

@messages_bp.route('/messages/<message_id>/read', methods=['POST'])
def mark_message_read(message_id):
    data = request.get_json()
    user_id = data.get('user_id', 'customer_1')

    # Find and update message status
    for conv_id, messages in messages_store.items():
        for msg in messages:
            if msg['id'] == message_id and msg['sender_id'] != user_id:
                msg['status'] = 'read'

                # Emit read receipt
                socketio.emit('message_read', {
                    'message_id': message_id,
                    'user_id': user_id,
                    'conversation_id': conv_id,
                    'read_at': datetime.utcnow().isoformat()
                }, room=conv_id)

                return jsonify({'message': 'Message marked as read'})

    return jsonify({'error': 'Message not found'}), 404

@messages_bp.route('/send-message', methods=['POST'])
def send_message_http():
    """HTTP endpoint for sending messages"""
    data = request.get_json()
    conversation_id = data.get('conversation_id', 'conv_1')
    sender_id = data.get('sender_id', 'customer_1')
    content = data.get('content', '')

    # Create message
    new_message = {
        'id': f'msg_{uuid.uuid4().hex[:8]}',
        'conversation_id': conversation_id,
        'sender_id': sender_id,
        'content': content,
        'message_type': 'text',
        'status': 'sent',
        'timestamp': datetime.utcnow().isoformat(),
        'sender': users_store.get(sender_id, {
            'id': sender_id,
            'name': 'You' if sender_id == 'customer_1' else 'AI Assistant',
            'avatar': 'SJ' if sender_id == 'customer_1' else 'AI'
        })
    }

    # Store message
    if conversation_id not in messages_store:
        messages_store[conversation_id] = []
    messages_store[conversation_id].append(new_message)

    result = {'user_message': new_message}

    # Emit via SocketIO if available
    socketio.emit('new_message', new_message, room=conversation_id)

    return jsonify(result)