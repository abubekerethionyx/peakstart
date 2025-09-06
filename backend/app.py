import os
import sys
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime
from extensions import db  # Import db from extensions

# -------------------------------------------------
# Setup logging so it always prints to stdout
# -------------------------------------------------
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)

logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Configuration
basedir = os.path.abspath(os.path.dirname(__file__))
instance_path = os.path.join(basedir, 'instance')

if not os.path.exists(instance_path):
    os.makedirs(instance_path)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(instance_path, 'peakstart.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

# Import models and routes after app and db are defined
import models
from routes import register_routes
register_routes(app)

# Create database tables
with app.app_context():
    db.create_all()

# -------------------------------------------------
# Logging middleware for requests & responses
# -------------------------------------------------
@app.before_request
def log_request():
    logger.info(f"➡️ {request.method} {request.path}")

@app.after_request
def log_response(response):
    logger.info(f"⬅️ {response.status} {request.method} {request.path}")
    return response

# -------------------------------------------------
# Error handler (catch all)
# -------------------------------------------------
@app.errorhandler(Exception)
def handle_exception(e):
    logger.exception("🔥 Internal Server Error")
    return jsonify({"error": "Internal Server Error"}), 500

# Health check
@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected" if db.engine.pool.checkedin() > 0 else "disconnected"
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
