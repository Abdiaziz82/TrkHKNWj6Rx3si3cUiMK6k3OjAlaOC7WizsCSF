from flask import Blueprint, request, jsonify
from app import db
from app.models.User import User
import re

register_bp = Blueprint('register', __name__)

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    # Basic phone validation - adjust based on requirements
    pattern = r'^\+?1?\d{9,15}$'
    return re.match(pattern, phone) is not None

@register_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validation checks
        required_fields = ['firstName', 'lastName', 'email', 'phoneNumber', 'password', 'confirmPassword']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        # Email validation
        if not validate_email(data['email']):
            return jsonify({
                'success': False,
                'message': 'Please provide a valid email address'
            }), 400
        
        # Phone validation
        if not validate_phone(data['phoneNumber']):
            return jsonify({
                'success': False,
                'message': 'Please provide a valid phone number'
            }), 400
        
        # Password confirmation
        if data['password'] != data['confirmPassword']:
            return jsonify({
                'success': False,
                'message': 'Passwords do not match'
            }), 400
        
        # Password strength
        if len(data['password']) < 8:
            return jsonify({
                'success': False,
                'message': 'Password must be at least 8 characters long'
            }), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({
                'success': False,
                'message': 'User with this email already exists'
            }), 409
        
        # Create new user
        new_user = User(
            first_name=data['firstName'],
            last_name=data['lastName'],
            email=data['email'],
            phone_number=data['phoneNumber'],
            role='customer'  # Explicitly assign customer role
        )
        new_user.set_password(data['password'])
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Registration successful! Welcome to TrkWholesale.',
            'user': new_user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'An error occurred during registration. Please try again.'
        }), 500