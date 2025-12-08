from app import app, db, Category, MenuItem

def seed_data():
    with app.app_context():
        # 1. Create Categories
        print("Creating Categories...")
        
        # Check if they exist first to avoid duplicates
        if not Category.query.filter_by(name="Appetizers").first():
            cat_appetizers = Category(name="Appetizers", description="Starters to whet your appetite")
            db.session.add(cat_appetizers)
        
        if not Category.query.filter_by(name="Main Dishes").first():
            cat_main = Category(name="Main Dishes", description="Hearty Japanese meals")
            db.session.add(cat_main)

        if not Category.query.filter_by(name="Drinks").first():
            cat_drinks = Category(name="Drinks", description="Refreshing beverages")
            db.session.add(cat_drinks)
        
        db.session.commit()

        # Re-fetch categories to get their IDs
        c_appetizer = Category.query.filter_by(name="Appetizers").first()
        c_main = Category.query.filter_by(name="Main Dishes").first()
        c_drinks = Category.query.filter_by(name="Drinks").first()

        # 2. Create Items
        print("Creating Menu Items...")

        # Appetizers
        if not MenuItem.query.filter_by(name="Edamame").first():
            item1 = MenuItem(name="Edamame", description="Steamed soybeans with sea salt", price=5.00, category_id=c_appetizer.category_id, is_drink=False)
            db.session.add(item1)
        
        if not MenuItem.query.filter_by(name="Gyoza").first():
            item2 = MenuItem(name="Gyoza", description="Pan-fried pork dumplings", price=7.50, category_id=c_appetizer.category_id, is_drink=False)
            db.session.add(item2)

        # Main Dishes
        if not MenuItem.query.filter_by(name="Ramen").first():
            item3 = MenuItem(name="Ramen", description="Classic Tonkotsu Ramen", price=14.00, category_id=c_main.category_id, is_drink=False)
            db.session.add(item3)

        # Drinks
        if not MenuItem.query.filter_by(name="Green Tea").first():
            item4 = MenuItem(name="Green Tea", description="Hot Japanese Green Tea", price=2.50, category_id=c_drinks.category_id, is_drink=True)
            db.session.add(item4)

        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()