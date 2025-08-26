# api_gateway/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables for service URLs
load_dotenv()

app = Flask(__name__)
CORS(app)

# Service URLs from environment variables
USER_SERVICE_URL = os.getenv('USER_SERVICE_URL', 'http://user_service:5001')
WORKER_SERVICE_URL = os.getenv('WORKER_SERVICE_URL', 'http://worker_service:5002')
FINANCIAL_SERVICE_URL = os.getenv('FINANCIAL_SERVICE_URL', 'http://financial_service:5003')

# A generic proxy function to forward requests
def proxy_request(service_url, path, method, data=None):
    url = f"{service_url}{path}"
    try:
        if method == 'GET':
            response = requests.get(url, params=request.args)
        elif method == 'POST':
            response = requests.post(url, json=data)
        # Add other methods (PUT, DELETE) as needed
        return response.json(), response.status_code
    except requests.exceptions.RequestException as e:
        return {'error': f'Failed to connect to service: {e}'}, 503

# --- User Service Routes ---
@app.route('/api/auth/<path:path>', methods=['GET', 'POST'])
def user_service_proxy(path):
    data = request.json if request.is_json else None
    return proxy_request(USER_SERVICE_URL, f'/api/auth/{path}', request.method, data)

# --- Worker Service Routes ---
@app.route('/api/workers/<path:path>', methods=['GET', 'POST'])
def worker_service_proxy(path):
    data = request.json if request.is_json else None
    return proxy_request(WORKER_SERVICE_URL, f'/api/workers/{path}', request.method, data)

# --- Financial Service Routes (including yields, sales, inventory) ---
@app.route('/api/dashboard', methods=['GET'])
@app.route('/api/yields', methods=['GET', 'POST'])
@app.route('/api/sales', methods=['GET', 'POST'])
@app.route('/api/financials', methods=['GET'])
@app.route('/api/inventory', methods=['GET', 'POST'])
def financial_service_proxy():
    path = request.path.replace('/api/', '')
    data = request.json if request.is_json else None
    return proxy_request(FINANCIAL_SERVICE_URL, f'/api/{path}', request.method, data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
