# from app import create_app, db
# from app.models.User import User

# def seed_admin():
#     app = create_app()
    
#     with app.app_context():
#         # Check if admin already exists
#         existing_admin = User.query.filter_by(email='wholesaler@gmail.com').first()
#         if not existing_admin:
#             admin_user = User(
#                 first_name='Ahmed',
#                 last_name='Ali',
#                 email='wholesaler@gmail.com',
#                 phone_number='+254700000000',
#                 role='admin'  # ✅ Set role as 'admin'
#             )
#             admin_user.set_password('Admin1234')
#             db.session.add(admin_user)
#             db.session.commit()
#             print("✅ Admin user created: wholesaler@gmail.com / Admin1234")
#         else:
#             print("✅ Admin user already exists")

# if __name__ == '__main__':
#     seed_admin()