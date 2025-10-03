from flask import Blueprint, request, jsonify, make_response
from app import db, bcrypt
from app.models.User import User
import jwt
import datetime
from functools import wraps

login_bp = Blueprint('login', __name__)

# JWT Configuration
JWT_SECRET_KEY = 'super-secret-jwt'  
JWT_ALGORITHM = 'HS256'
JWT_EXPIRY_HOURS = 24

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('access_token')
        
        if not token:
            return jsonify({
                'success': False,
                'message': 'Token is missing'
            }), 401
        
        try:
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            current_user = User.query.get(data['user_id'])
            
            if not current_user:
                return jsonify({
                    'success': False,
                    'message': 'Invalid token'
                }), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({
                'success': False,
                'message': 'Token has expired'
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                'success': False,
                'message': 'Invalid token'
            }), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

@login_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validation checks
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400

        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            return jsonify({
                'success': False,
                'message': 'Email and password are required'
            }), 400

        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'Invalid email or password'
            }), 401

        # Check if user is active
        if not user.is_active:
            return jsonify({
                'success': False,
                'message': 'Account is deactivated. Please contact support.'
            }), 401

        # Verify password
        if not user.check_password(password):
            return jsonify({
                'success': False,
                'message': 'Invalid email or password'
            }), 401

        # Generate JWT token
        token_payload = {
            'user_id': user.id,
            'email': user.email,
            'role': user.role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXPIRY_HOURS)
        }
        
        token = jwt.encode(token_payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

        # Create response with user data
        response_data = {
            'success': True,
            'message': 'Login successful!',
            'user': user.to_dict()
        }

        response = make_response(jsonify(response_data))
        
        # Set HTTP-only cookie with JWT token
        response.set_cookie(
            'access_token',
            token,
            httponly=True,
            secure=False,  
            samesite='Lax',
            max_age=JWT_EXPIRY_HOURS * 3600  # 24 hours
        )
        
        return response, 200

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'An error occurred during login. Please try again.'
        }), 500

@login_bp.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({
        'success': True,
        'message': 'Logged out successfully'
    }))
    
    # Clear the access token cookie
    response.set_cookie('access_token', '', expires=0)
    return response

@login_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({
        'success': True,
        'user': current_user.to_dict()
    })