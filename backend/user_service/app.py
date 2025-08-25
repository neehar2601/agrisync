# user_service/app.py
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import os
from dotenv import load_dotenv

# Load environment variables for the database URL
load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# =========================================================================
# User-specific Database Model
# =========================================================================
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    unique_user_id = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<User {self.email}>"

# =========================================================================
# User-specific API Endpoints
# =========================================================================
@app.route('/api/auth/register', methods=['POST'])
def register_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(
        unique_user_id=str(uuid.uuid4()),
        email=email,
        password_hash=hashed_password,
        name=name
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Login successful', 'userId': user.unique_user_id}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/auth/user-id', methods=['GET'])
def get_current_user_id():
    return jsonify({'userId': 'user_1a2b3c4d'}), 200

if __name__ == '__main__':
    with app.app_context():
        # This will create the users table only
        db.create_all()
    app.run(host='0.0.0.0', port=5001, debug=True)
