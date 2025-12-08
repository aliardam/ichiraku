from app import app, db
from sqlalchemy import text

with app.app_context():
    print("Checking database columns...")
    try:
        # We use raw SQL to force the column addition
        with db.engine.connect() as conn:
            # 1. Fix Menu_Items table (Add image column)
            try:
                print("Attempting to add 'image' column to Menu_Items...")
                conn.execute(text("ALTER TABLE Menu_Items ADD COLUMN image VARCHAR(255)"))
                print("SUCCESS: 'image' column added.")
            except Exception as e:
                print(f"Note: Could not add 'image' column (it might already exist). Error: {e}")

            # 2. Fix Users table (Add role column if missing)
            try:
                print("Attempting to add 'role' column to Users...")
                conn.execute(text("ALTER TABLE Users ADD COLUMN role VARCHAR(20) DEFAULT 'user'"))
                print("SUCCESS: 'role' column added.")
            except Exception as e:
                print(f"Note: Could not add 'role' column. Error: {e}")
                
            conn.commit()
            print("Database fix complete!")
            
    except Exception as e:
        print(f"Critical Database Error: {e}")