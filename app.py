# app.py
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, date
import uuid # For generating unique user IDs
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize the Flask application
app = Flask(__name__)

# Enable CORS (Cross-Origin Resource Sharing) to allow requests from your React frontend
CORS(app)

# Database configuration
# IMPORTANT: Replace 'username' and 'password' with your PostgreSQL credentials
# For a cloud-native setup, these should be environment variables.
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost:5432/farmsync'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# =========================================================================
# Database Models
# These classes define the structure of your database tables.
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
# API Endpoints
# =========================================================================

# User Authentication (for demonstration, a simple unique user ID is used)
def get_user_id():
    """Helper function to get user ID for demo purposes."""
    # In a real app, this would come from a secure session or token
    # For now, we'll use a hardcoded user ID
    user = User.query.filter_by(unique_user_id='user_1a2b3c4d').first()
    if not user:
        # Create a dummy user if one doesn't exist
        user = User(
            unique_user_id='user_1a2b3c4d',
            email='demo@farmsync.com',
            password_hash=generate_password_hash('password'),
            name='Demo User'
        )
        db.session.add(user)
        db.session.commit()
    return user.id

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
        # In a real application, you would create and return a JWT token here.
        # For this demo, we'll just return the user ID.
        return jsonify({'message': 'Login successful', 'userId': user.unique_user_id}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/auth/user-id', methods=['GET'])
def get_current_user_id():
    # Helper endpoint for the frontend to get a persistent user ID for demo purposes
    return jsonify({'userId': 'user_1a2b3c4d'}), 200

# Dashboard Endpoints
@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    user_id = get_user_id()
    
    # Financial Summary
    revenue_sum = db.session.query(db.func.sum(Financial.amount)).filter_by(user_id=user_id, type='Revenue').scalar() or 0
    expenses_sum = db.session.query(db.func.sum(Financial.amount)).filter_by(user_id=user_id, type='Expense').scalar() or 0

    # Yield & Workforce Metrics
    total_yield = db.session.query(db.func.sum(Yield.quantity)).filter_by(user_id=user_id).scalar() or 0
    active_workers = Worker.query.filter_by(user_id=user_id, is_active=True).count()
    
    # Financial Trends (simplified for demo)
    financial_trends = [
        {'month': 'Jan', 'revenue': 50000, 'expenses': 20000},
        {'month': 'Feb', 'revenue': 60000, 'expenses': 25000},
        {'month': 'Mar', 'revenue': 75000, 'expenses': 30000},
    ]

    return jsonify({
        'financialSummary': {'totalRevenue': revenue_sum, 'totalExpenses': expenses_sum},
        'metrics': {'totalYield': total_yield, 'activeWorkers': active_workers},
        'financialTrends': financial_trends
    })

# Yield & Sales Endpoints
@app.route('/api/yields', methods=['GET'])
def get_yields():
    user_id = get_user_id()
    yields = Yield.query.filter_by(user_id=user_id).order_by(Yield.date_recorded.desc()).all()
    result = [{
        'id': y.id,
        'cropName': y.crop_name,
        'quantity': y.quantity,
        'unit': y.unit
    } for y in yields]
    return jsonify(result)

@app.route('/api/yields', methods=['POST'])
def add_yield():
    user_id = get_user_id()
    data = request.json
    try:
        new_yield = Yield(
            user_id=user_id,
            crop_name=data['name'],
            quantity=int(data['quantity']),
            unit=data['unit'],
            date_recorded=datetime.utcnow().date()
        )
        db.session.add(new_yield)
        db.session.commit()
        return jsonify({'message': 'Yield added successfully!', 'id': new_yield.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/sales', methods=['GET'])
def get_sales():
    user_id = get_user_id()
    sales = Sale.query.filter_by(user_id=user_id).order_by(Sale.date_of_sale.desc()).all()
    result = [{
        'id': s.id,
        'cropName': s.crop_name,
        'quantity': s.quantity_sold,
        'price': s.price,
        'seller': s.seller_name,
        'date': s.date_of_sale.isoformat()
    } for s in sales]
    return jsonify(result)

@app.route('/api/sales', methods=['POST'])
def record_sale():
    user_id = get_user_id()
    data = request.json
    try:
        # Check if yield_id exists
        existing_yield = Yield.query.filter_by(id=data['cropId'], user_id=user_id).first()
        if not existing_yield:
            return jsonify({'message': 'Invalid crop ID'}), 400

        quantity_sold = int(data['quantity'])
        price = int(data['price'])
        
        # Record the sale
        new_sale = Sale(
            user_id=user_id,
            yield_id=existing_yield.id,
            crop_name=existing_yield.crop_name,
            quantity_sold=quantity_sold,
            price=price,
            seller_name=data['seller'],
            date_of_sale=datetime.utcnow().date()
        )
        db.session.add(new_sale)

        # Update the yield quantity (simple deduction)
        existing_yield.quantity -= quantity_sold

        # Record the revenue in financials
        new_revenue = Financial(
            user_id=user_id,
            type='Revenue',
            description=f"Sale of {existing_yield.crop_name}",
            amount=price,
            transaction_date=datetime.utcnow().date(),
            crop_name=existing_yield.crop_name
        )
        db.session.add(new_revenue)

        db.session.commit()
        return jsonify({'message': 'Sale recorded successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# Worker Management Endpoints
@app.route('/api/workers', methods=['GET'])
def get_workers():
    user_id = get_user_id()
    workers = Worker.query.filter_by(user_id=user_id).order_by(Worker.name).all()
    result = [{
        'id': w.id,
        'name': w.name,
        'role': w.role,
        'payRate': w.pay_rate,
        'payType': w.pay_type,
        'loans': w.loans,
        'active': w.is_active
    } for w in workers]
    return jsonify(result)

@app.route('/api/workers', methods=['POST'])
def add_worker():
    user_id = get_user_id()
    data = request.json
    try:
        new_worker = Worker(
            user_id=user_id,
            name=data['name'],
            role=data['role'],
            pay_rate=int(data['payRate']),
            pay_type=data['payType']
        )
        db.session.add(new_worker)
        db.session.commit()
        return jsonify({'message': 'Worker added successfully!', 'id': new_worker.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/workers/<int:worker_id>', methods=['GET'])
def get_worker_details(worker_id):
    user_id = get_user_id()
    worker = Worker.query.filter_by(id=worker_id, user_id=user_id).first()
    if not worker:
        return jsonify({'message': 'Worker not found'}), 404

    # Fetch attendance and loan history
    attendance_data = Attendance.query.filter_by(worker_id=worker_id).order_by(Attendance.attendance_date).all()
    loan_transactions = Financial.query.filter_by(user_id=user_id, description=f"Loan to {worker.name}").all()
    payroll_transactions = Financial.query.filter_by(user_id=user_id, description=f"Worker salary - {worker.name}").all()

    # Format data for frontend
    attendance = {a.attendance_date.isoformat(): {'status': a.status, 'hours': a.hours} for a in attendance_data}
    loans = [{'date': l.transaction_date.isoformat(), 'amount': l.amount, 'description': l.description} for l in loan_transactions]

    worker_data = {
        'id': worker.id,
        'name': worker.name,
        'role': worker.role,
        'payRate': worker.pay_rate,
        'payType': worker.pay_type,
        'loans': worker.loans,
        'active': worker.is_active
    }
    return jsonify({'worker': worker_data, 'attendance': attendance, 'loans': loans})

@app.route('/api/workers/<int:worker_id>/attendance', methods=['POST'])
def mark_attendance(worker_id):
    data = request.json
    attendance_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    attendance = Attendance.query.filter_by(worker_id=worker_id, attendance_date=attendance_date).first()

    if attendance:
        attendance.status = data['status']
        attendance.hours = data['hours']
    else:
        new_attendance = Attendance(
            worker_id=worker_id,
            attendance_date=attendance_date,
            status=data['status'],
            hours=data['hours']
        )
        db.session.add(new_attendance)

    db.session.commit()
    return jsonify({'message': 'Attendance updated successfully!'})

@app.route('/api/workers/<int:worker_id>/loan', methods=['POST'])
def add_loan(worker_id):
    user_id = get_user_id()
    data = request.json
    worker = Worker.query.filter_by(id=worker_id, user_id=user_id).first()
    if not worker:
        return jsonify({'message': 'Worker not found'}), 404

    amount = int(data['amount'])
    description = data['description']

    worker.loans += amount
    
    new_financial = Financial(
        user_id=user_id,
        type='Expense',
        description=f"Loan to {worker.name} - {description}",
        amount=amount,
        transaction_date=datetime.utcnow().date(),
        crop_name=None
    )
    db.session.add(new_financial)
    db.session.commit()
    return jsonify({'message': 'Loan recorded successfully!'})

@app.route('/api/workers/<int:worker_id>/payroll', methods=['POST'])
def calculate_payroll(worker_id):
    user_id = get_user_id()
    data = request.json
    worker = Worker.query.filter_by(id=worker_id, user_id=user_id).first()
    if not worker:
        return jsonify({'message': 'Worker not found'}), 404
        
    deduction = int(data.get('deduction', 0))
    
    # Calculate total pay for the last 7 days
    start_date = datetime.utcnow().date() - datetime.timedelta(days=7)
    attendance_records = Attendance.query.filter(
        Attendance.worker_id == worker_id,
        Attendance.attendance_date >= start_date
    ).all()
    
    total_pay = 0
    if worker.pay_type == 'Daily':
        present_days = sum(1 for rec in attendance_records if rec.status == 'Present')
        total_pay = present_days * worker.pay_rate
    else: # Hourly
        total_hours = sum(rec.hours for rec in attendance_records)
        total_pay = total_hours * worker.pay_rate
        
    net_pay = total_pay - deduction
    
    # Update worker's loan balance if there's a deduction
    worker.loans -= deduction
    
    # Record the transaction in Financials
    new_financial = Financial(
        user_id=user_id,
        type='Expense',
        description=f"Worker salary - {worker.name}",
        amount=net_pay,
        transaction_date=datetime.utcnow().date(),
        crop_name=None
    )
    db.session.add(new_financial)
    db.session.commit()
    
    return jsonify({'message': 'Payroll processed', 'totalPay': total_pay, 'deduction': deduction, 'netPay': net_pay})


# Financial Endpoints
@app.route('/api/financials', methods=['GET'])
def get_financials():
    user_id = get_user_id()
    financials = Financial.query.filter_by(user_id=user_id).order_by(Financial.transaction_date.desc()).all()
    result = [{
        'id': f.id,
        'type': f.type,
        'description': f.description,
        'amount': f.amount,
        'date': f.transaction_date.isoformat(),
        'crop': f.crop_name
    } for f in financials]
    return jsonify(result)

@app.route('/api/financials/revenue', methods=['POST'])
def add_revenue():
    user_id = get_user_id()
    data = request.json
    try:
        new_financial = Financial(
            user_id=user_id,
            type='Revenue',
            description=data['description'],
            amount=int(data['amount']),
            transaction_date=datetime.utcnow().date(),
            crop_name=data.get('cropName')
        )
        db.session.add(new_financial)
        db.session.commit()
        return jsonify({'message': 'Revenue recorded successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/financials/expense', methods=['POST'])
def add_expense():
    user_id = get_user_id()
    data = request.json
    try:
        new_financial = Financial(
            user_id=user_id,
            type='Expense',
            description=data['description'],
            amount=int(data['amount']),
            transaction_date=datetime.utcnow().date(),
            crop_name=data.get('cropName')
        )
        db.session.add(new_financial)
        db.session.commit()
        return jsonify({'message': 'Expense recorded successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# Inventory Endpoints
@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    user_id = get_user_id()
    inventory = Inventory.query.filter_by(user_id=user_id).order_by(Inventory.item_name).all()
    result = [{
        'id': i.id,
        'itemName': i.item_name,
        'itemType': i.item_type,
        'quantity': i.quantity,
        'unit': i.unit
    } for i in inventory]
    return jsonify(result)

@app.route('/api/inventory', methods=['POST'])
def add_inventory_item():
    user_id = get_user_id()
    data = request.json
    try:
        new_inventory = Inventory(
            user_id=user_id,
            item_name=data['name'],
            item_type=data['type'],
            quantity=int(data['quantity']),
            unit=data['unit']
        )
        db.session.add(new_inventory)
        db.session.commit()
        return jsonify({'message': 'Inventory item added successfully!', 'id': new_inventory.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# =========================================================================
# Main application entry point
# =========================================================================

if __name__ == '__main__':
    with app.app_context():
        # This will create all the tables in the database if they do not exist
        db.create_all()
    app.run(debug=True, port=5000)
