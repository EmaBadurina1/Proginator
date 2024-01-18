import os
from flask import Flask

from flask_cors import CORS
from dotenv import load_dotenv
from controllers import *
from db import db
from mail import mail


def build_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    app.register_blueprint(accounts_bp)
    app.register_blueprint(appointments_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(devices_bp)
    app.register_blueprint(rooms_bp)
    app.register_blueprint(therapies_bp)

    load_dotenv()
    DB_URL = os.getenv("DB_URL")
    EXTERNAL_DB_URL = os.getenv("EXTERNAL_DB_URL")
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
    app.config["SQLALCHEMY_ECHO"] = False
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning
    app.config["SQLALCHEMY_RECORD_QUERIES"] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
    app.config["SESSION_COOKIE_SAMESITE"] = "None"
    app.config["SESSION_COOKIE_SECURE"] = True
    app.config["CORS_HEADERS"] = "Content-Type"
    app.config["SESSION_PROTECTION"] = "strong"
    app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER")
    app.config["MAIL_PORT"] = os.getenv("MAIL_PORT")
    app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
    app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
    app.config["MAIL_USE_TLS"] = False
    app.config["MAIL_USE_SSL"] = True
    return app


app = build_app()

db.init_app(app)
mail.init_app(app)

if __name__ == "__main__":
    app.run()
