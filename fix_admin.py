from app import app, db, Users
from flask_bcrypt import Bcrypt
from werkzeug.security import generate_password_hash

bcrypt = Bcrypt(app)

with app.app_context():
    # 1. Find the admin user
    email = "aliardam402@gmail.com"
    user = Users.query.filter_by(email=email).first()

    if user:
        # 2. Update password with a proper Hash
        # Note: We use the same method 'generate_password_hash' used in your register route
        hashed_password = generate_password_hash("Root@123") 
        
        user.password = hashed_password
        user.role = "admin" # Ensure role is set
        
        db.session.commit()
        print(f"Success! Password for {email} has been reset and hashed.")
    else:
        print("User not found! Please register the user first via the website.")