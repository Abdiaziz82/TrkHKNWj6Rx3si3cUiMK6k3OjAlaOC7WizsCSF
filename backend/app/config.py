import os
from datetime import timedelta

class Config:
    # SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    
    # # Database
    # SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///inventory.db'
    # SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # # JWT
    # JWT_SECRET_KEY = "super-secret-jwt"
    # JWT_ALGORITHM = "HS256"
    
    # File Upload Configuration
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads', 'products')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    
    # Allowed extensions
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    
    # Ensure upload directory exists
    @staticmethod
    def init_upload_dirs(app):
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)