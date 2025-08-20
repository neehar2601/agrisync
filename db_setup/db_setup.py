# db_setup.py
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid # For generating unique user IDs
from werkzeug.security import generate_password_hash, check_password_hash

# A separate Flask app instance just for the database setup script
app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://farmappapi:Farmapp123@127.0.0.1:5432/farmsync'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database object
db = SQLAlchemy(app)

# =========================================================================
# Database Models
# These classes define the structure of your database tables.
# They are now all located here.
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

class Worker(db.Model):
    __tablename__ = 'workers'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    pay_rate = db.Column(db.Integer, nullable=False)
    pay_type = db.Column(db.String(20), nullable=False) # 'Daily' or 'Hourly'
    loans = db.Column(db.Integer, default=0, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    def __repr__(self):
        return f"<Worker {self.name}>"

class Attendance(db.Model):
    __tablename__ = 'attendance'
    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('workers.id'), nullable=False)
    attendance_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False) # 'Present', 'Absent'
    hours = db.Column(db.Integer, default=0, nullable=False)

    __table_args__ = (db.UniqueConstraint('worker_id', 'attendance_date', name='_worker_date_uc'),)

    def __repr__(self):
        return f"<Attendance {self.worker_id} on {self.attendance_date}>"

class Yield(db.Model):
    __tablename__ = 'yields'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    crop_name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit = db.Column(db.String(20), nullable=False)
    date_recorded = db.Column(db.Date, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<Yield {self.crop_name}>"

class Sale(db.Model):
    __tablename__ = 'sales'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    yield_id = db.Column(db.Integer, db.ForeignKey('yields.id'), nullable=True)
    crop_name = db.Column(db.String(100), nullable=False)
    quantity_sold = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    seller_name = db.Column(db.String(100), nullable=False)
    date_of_sale = db.Column(db.Date, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<Sale {self.seller_name}>"

class Financial(db.Model):
    __tablename__ = 'financials'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False) # 'Revenue' or 'Expense'
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    transaction_date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    crop_name = db.Column(db.String(100), nullable=True)

    def __repr__(self):
        return f"<Financial {self.description}>"

class Inventory(db.Model):
    __tablename__ = 'inventory'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    item_name = db.Column(db.String(100), nullable=False)
    item_type = db.Column(db.String(50), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f"<Inventory {self.item_name}>"

# =========================================================================
# Main application entry point for setup
# =========================================================================

def setup_database():
    """
    Creates all database tables defined in the SQLAlchemy models.
    """
    with app.app_context():
        try:
            print("Attempting to create all database tables...")
            db.create_all()
            print("Database tables created successfully! 🎉")
        except Exception as e:
            print(f"Error creating database tables: {e}")
            print("Please ensure your PostgreSQL user has the necessary privileges.")
            print("You can grant permissions with the following SQL command:")
            print("GRANT ALL PRIVILEGES ON SCHEMA public TO farmappapi;")
            
if __name__ == "__main__":
    setup_database()
