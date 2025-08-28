import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime
from extensions import db  # Import db from extensions

# Initialize Flask app
app = Flask(__name__)

# Configuration
# Define the absolute path for the database
basedir = os.path.abspath(os.path.dirname(__file__))
instance_path = os.path.join(basedir, 'instance')

# Ensure the instance directory exists
if not os.path.exists(instance_path):
    os.makedirs(instance_path)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(instance_path, 'peakstart.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], allow_headers=["Content-Type", "Authorization"])

# Import models and routes after app and db are defined and initialized
import models
from routes import register_routes # Import register_routes function

# Register routes with the app instance
register_routes(app)

# Create database tables
with app.app_context():
    db.create_all()

# Remove generic home route to avoid conflict
# @app.route('/')
# def home():
#     return jsonify({
#         "message": "PeakStart Construction API",
#         "version": "1.0.0",
#         "status": "running"
#     })

# Remove generic health_check route to avoid conflict
@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected" if db.engine.pool.checkedin() > 0 else "disconnected"
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
