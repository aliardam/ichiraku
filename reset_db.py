from app import app, db

with app.app_context():
    print("Deleting old tables...")
    db.drop_all()  # This deletes the outdated tables
    print("Creating new tables...")
    db.create_all() # This creates the new tables with 'image_filename' and 'Orders'
    print("Database reset successfully!")