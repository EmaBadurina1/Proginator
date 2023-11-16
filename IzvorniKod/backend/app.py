from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from controllers import accounts_bp, appointments_bp
from models import *
from db import db

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.register_blueprint(accounts_bp)
app.register_blueprint(appointments_bp)

if __name__ == '__main__':
    load_dotenv()
    DB_URL = os.getenv("DB_URL")
    app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")

    db.init_app(app)
    # migrate.init_app(app, db)
    
    with app.app_context():
        db.create_all()
      
    app.run(debug=True)