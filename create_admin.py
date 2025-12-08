from app import app, db, Users
from werkzeug.security import generate_password_hash

def create_admin():
    with app.app_context():
        email = "aliardam402@gmail.com"
        password = "Root@123"
        
        # Check if user already exists
        existing_user = Users.query.filter_by(email=email).first()
        
        if existing_user:
            print(f"User {email} already exists. Updating password and role...")
            existing_user.password = generate_password_hash(password)
            existing_user.role = "admin"
        else:
            print(f"Creating new admin user: {email}")
            new_user = Users(
                name="Admin Ali",
                email=email,
                phone="1234567890", # Dummy phone needed for DB constraints
                password=generate_password_hash(password),
                role="admin",
                address="Restaurant HQ"
            )
            db.session.add(new_user)
        
        try:
            db.session.commit()
            print("------------------------------------------")
            print("SUCCESS! Admin user created/updated.")
            print(f"Login Email: {email}")
            print(f"Login Pass:  {password}")
            print("------------------------------------------")
        except Exception as e:
            print(f"Error: {e}")
            db.session.rollback()

if __name__ == "__main__":
    create_admin()