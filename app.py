from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, text
from flask_login import UserMixin
from flask_bcrypt import Bcrypt
import urllib.parse
from flask_cors import CORS
import os
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_migrate import Migrate
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your-secret-key-here'

# --- CONFIGURATION ---
password = "Root@123"
encoded_password = urllib.parse.quote_plus(password)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:Root%40123@localhost/japanese_restaurant"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Image Upload Config
UPLOAD_FOLDER = os.path.join('static', 'assets')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)

# --- HELPERS ---
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- MODELS ---
class Users(db.Model, UserMixin):
    __tablename__ = 'Users'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=True)
    phone = db.Column(db.String(20), unique=True, nullable=True)
    address = db.Column(db.String(255), nullable=True)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="user")
    orders = db.relationship('Order', backref='user', lazy=True)

class Category(db.Model):
    __tablename__ = 'Categories'
    category_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    items = db.relationship('MenuItem', backref='category', lazy=True)

class MenuItem(db.Model):
    __tablename__ = 'Menu_Items'
    item_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(6, 2), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('Categories.category_id'), nullable=False)
    is_drink = db.Column(db.Boolean, default=False)
    image = db.Column(db.String(255), nullable=True)

class Order(db.Model):
    __tablename__ = 'Orders'
    order_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='Pending')
    total_amount = db.Column(db.Numeric(10, 2), default=0.00)
    order_type = db.Column(db.String(20), default='dine-in') 
    items = db.relationship('OrderItem', backref='order', lazy=True)

class OrderItem(db.Model):
    __tablename__ = 'Order_Items'
    order_item_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('Orders.order_id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('Menu_Items.item_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    item_name = db.Column(db.String(100), nullable=True)
    price = db.Column(db.Numeric(6, 2), nullable=True)

# --- PAGE ROUTES ---
@app.route('/')
def home(): return render_template('index.html')

@app.route('/menu')
def menu(): return render_template('menu.html')

@app.route('/login')
def login_page(): return render_template('login.html')

@app.route('/admin')
def admin_page(): return render_template('admin.html')

@app.route('/order')
def order_page(): return render_template('order.html')

@app.route('/static/assets/<path:filename>')
def serve_static(filename):
    return send_from_directory('static/assets', filename)

# --- AUTH ROUTES ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name, email, phone = data.get('name'), data.get('email'), data.get('phone')
    password, address = data.get('password'), data.get('address')

    if not name or not password or (not email and not phone):
        return jsonify({'error': 'Required fields missing'}), 400

    new_user = Users(name=name, email=email, phone=phone, address=address, password=generate_password_hash(password))
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully!'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    identifier, password = data.get('identifier'), data.get('password')

    user = Users.query.filter((Users.email == identifier) | (Users.phone == identifier)).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    user_data = {'id': user.user_id, 'name': user.name, 'email': user.email}
    role = 'admin' if (user.email == "aliardam402@gmail.com" or user.role == 'admin') else 'user'
    
    return jsonify({'message': 'Login successful', 'role': role, 'user': user_data})

# --- MENU API ---
@app.route('/api/menu', methods=['GET'])
def get_menu():
    categories = Category.query.all()
    menu = []
    for cat in categories:
        items = []
        for i in cat.items:
            img_url = f"/static/assets/{i.image}" if i.image else "/static/assets/placeholder.png"
            items.append({
                "item_id": i.item_id,
                "name": i.name,
                "description": i.description,
                "price": float(i.price),
                "is_drink": i.is_drink,
                "image": img_url 
            })
        menu.append({"category": cat.name, "description": cat.description, "items": items})
    return jsonify(menu)

@app.route('/api/menu/<category_name>')
def get_menu_by_category(category_name):
    # Safe check for category existence
    category = Category.query.filter(func.lower(Category.name) == category_name.lower()).first()
    if not category:
        return jsonify([]), 200 # Return empty list instead of 404 to prevent frontend crashes

    items = MenuItem.query.filter_by(category_id=category.category_id).all()
    return jsonify([{
        "id": item.item_id,
        "name": item.name,
        "description": item.description,
        "price": float(item.price),
        "category": category.name,
        "is_drink": item.is_drink,
        "image": f"/static/assets/{item.image}" if item.image else "/static/assets/placeholder.png"
    } for item in items])

@app.route('/api/categories', methods=['GET'])
def get_categories():
    cats = Category.query.all()
    return jsonify([{"id": c.category_id, "name": c.name} for c in cats])

# --- ORDER API ---
@app.route('/api/place_order', methods=['POST'])
def place_order():
    data = request.get_json()
    user_id = data.get('user_id')
    items = data.get('items') 

    if not user_id or not items: return jsonify({"error": "Invalid data"}), 400

    total_amount = 0
    order_items_objects = []

    for item in items:
        menu_item = MenuItem.query.get(item['id'])
        if menu_item:
            qty = item.get('quantity', 1)
            total_amount += (menu_item.price * qty)
            order_items_objects.append(OrderItem(
                item_id=menu_item.item_id, item_name=menu_item.name, quantity=qty, price=menu_item.price
            ))

    new_order = Order(user_id=user_id, total_amount=total_amount, status="Pending")
    try:
        db.session.add(new_order)
        db.session.commit()
        for oi in order_items_objects:
            oi.order_id = new_order.order_id
            db.session.add(oi)
        db.session.commit()
        return jsonify({"message": "Order placed", "order_id": new_order.order_id})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/my_orders/<int:user_id>', methods=['GET'])
def get_user_orders(user_id):
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.order_date.desc()).all()
    result = []
    for order in orders:
        items = [{"name": i.item_name, "quantity": i.quantity, "price": float(i.price or 0)} for i in order.items]
        result.append({
            "order_id": order.order_id,
            "date": order.order_date.strftime("%Y-%m-%d %H:%M"),
            "total": float(order.total_amount or 0),
            "status": order.status,
            "items": items
        })
    return jsonify(result)

# --- ADMIN API (COMPLETE) ---

# 1. GET ALL ITEMS (Was missing!)
@app.route('/api/admin/items', methods=['GET'])
def admin_get_items():
    try:
        items = MenuItem.query.all()
        results = []
        for item in items:
            cat_name = item.category.name if item.category else "Uncategorized"
            img_path = f"/static/assets/{item.image}" if item.image else "/static/assets/placeholder.png"
            results.append({
                "id": item.item_id,
                "name": item.name,
                "price": float(item.price),
                "category": cat_name,
                "image": img_path
            })
        return jsonify(results)
    except Exception as e:
        print(f"Error fetching admin items: {e}")
        return jsonify([]), 500

# 2. ADD ITEM
@app.route('/api/admin/add_item', methods=['POST'])
def admin_add_item():
    try:
        name = request.form.get('name')
        description = request.form.get('description')
        price = request.form.get('price')
        category_id = request.form.get('category_id')
        is_drink = request.form.get('is_drink', 'false').lower() == 'true'
        
        image_filename = None
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                filename = f"{int(datetime.now().timestamp())}_{secure_filename(file.filename)}"
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                image_filename = filename

        new_item = MenuItem(name=name, description=description, price=price, category_id=category_id, is_drink=is_drink, image=image_filename)
        db.session.add(new_item)
        db.session.commit()
        return jsonify({"message": "Item added"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 3. EDIT ITEM (Was missing!)
@app.route('/api/admin/edit_item/<int:item_id>', methods=['PUT', 'POST'])
def admin_edit_item(item_id):
    item = MenuItem.query.get(item_id)
    if not item: return jsonify({"error": "Not found"}), 404
    
    item.name = request.form.get('name', item.name)
    item.description = request.form.get('description', item.description)
    item.price = request.form.get('price', item.price)
    item.category_id = request.form.get('category_id', item.category_id)
    if 'is_drink' in request.form:
        item.is_drink = request.form.get('is_drink').lower() == 'true'

    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            filename = f"{int(datetime.now().timestamp())}_{secure_filename(file.filename)}"
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            item.image = filename

    db.session.commit()
    return jsonify({"message": "Item updated"})

# 4. DELETE ITEM (Was missing!)
@app.route('/api/admin/delete_item/<int:item_id>', methods=['DELETE'])
def admin_delete_item(item_id):
    item = MenuItem.query.get(item_id)
    if not item: return jsonify({"error": "Not found"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item deleted"})

if __name__ == '__main__':
    app.run(debug=True)