from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from flask_login import UserMixin
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError
from flask_bcrypt import Bcrypt
import urllib.parse
from flask_cors import CORS
import os
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your-secret-key-here'

# URL-encode the password to handle special characters
password = "Root@123"
encoded_password = urllib.parse.quote_plus(password)

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:Root%40123@localhost/japanese_restaurant"


app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# ---------- MODELS ----------
class Users(db.Model, UserMixin):
    __tablename__ = 'Users'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=True)
    phone = db.Column(db.String(20), unique=True, nullable=True)
    address = db.Column(db.String(255), nullable=True)
    password = db.Column(db.String(255), nullable=False)

class Category(db.Model):
    __tablename__ = 'Categories'

    category_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)

    # Relationship to menu items
    items = db.relationship('MenuItem', backref='category', lazy=True)

class MenuItem(db.Model):
    __tablename__ = 'Menu_Items'

    item_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(6, 2), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('Categories.category_id'), nullable=False)
    is_drink = db.Column(db.Boolean, default=False)


# ---------- FORMS ----------
class LoginForm(FlaskForm):
    name = StringField(validators=[InputRequired(), Length(min=3, max=100)],
                       render_kw={"placeholder": "Name"})
    password = PasswordField(validators=[InputRequired(), Length(min=6, max=100)],
                             render_kw={"placeholder": "Password"})
    submit = SubmitField("Login")




# ---------- ROUTES ----------
@app.route('/')
def index():
    return render_template('index.html')

# Registration endpoint
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    address = data.get('address')

    if not name or not password or (not email and not phone):
        return jsonify({'error': 'Name, password, and at least email or phone are required.'}), 400

    hashed_password = generate_password_hash(password, method='sha256')

    new_user = Users(
        name=name,
        email=email,
        phone=phone,
        address=address,
        password=hashed_password
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully!'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    

@app.route('/menu')
def menu():
    return render_template('menu.html')

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()

    identifier = data.get('identifier')
    password = data.get('password')

    if not identifier or not password:
        return jsonify({'error': 'Identifier and password required'}), 400

    # Login using email or phone
    user = Users.query.filter(
        (Users.email == identifier) | (Users.phone == identifier)
    ).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not check_password_hash(user.password, password):
        return jsonify({'error': 'Incorrect password'}), 401

    # Example admin check
    if user.email == "admin@restaurant.com":
        return jsonify({'message': 'Admin login', 'role': 'admin'})

    return jsonify({'message': 'User login', 'role': 'user'})


@app.route('/api/menu', methods=['GET', 'POST'])
def get_menu():
    categories = Category.query.all()
    menu = []

    for cat in categories:
        items = [{
            "item_id": i.item_id,
            "name": i.name,
            "description": i.description,
            "price": float(i.price),
            "is_drink": i.is_drink
        } for i in cat.items]


        menu.append({
            "category": cat.name,
            "description": cat.description,
            "items": items
        })

    return jsonify(menu)

@app.route('/api/categories')
def get_categories():
    categories = Category.query.all()
    category_list = []
    
    for cat in categories:
        category_list.append({
            "id": cat.category_id,
            "name": cat.name,
            "description": cat.description
        })
    
    return jsonify(category_list)

@app.route('/api/menu/<category_name>')
def get_menu_by_category(category_name):
    # Make search case-insensitive
    category = Category.query.filter(func.lower(Category.name) == category_name.lower()).first()

    if not category:
        return jsonify({"error": "Category not found"}), 404

    # Fetch all items for that category
    items = MenuItem.query.filter_by(category_id=category.category_id).all()

    # Return all matching items
    return jsonify([
        {
            "id": item.item_id,
            "name": item.name,
            "description": item.description,
            "price": float(item.price),
            "category": category.name,
            "is_drink": item.is_drink
        }
        for item in items
    ])
    
    return jsonify(items_list)

# Serve static files (images)
@app.route('/static/assets/<path:filename>')
def serve_static(filename):
    return send_from_directory('static/assets', filename)


# ---------- RUN APP ----------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
