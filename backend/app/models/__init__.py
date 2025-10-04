# Import models separately to avoid circular imports
from .User import User

# We'll configure relationships after all models are loaded
__all__ = ['User']