import os
from flask import Flask

from flask_cors import CORS
from dotenv import load_dotenv
from controllers import accounts_bp, appointments_bp
from db import db

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.register_blueprint(accounts_bp)
app.register_blueprint(appointments_bp)

load_dotenv()
DB_URL = os.getenv("DB_URL")
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config["SQLALCHEMY_ECHO"] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning
app.config["SQLALCHEMY_RECORD_QUERIES"] = True
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL

db.init_app(app)

if __name__ == '__main__':
    app.run()
