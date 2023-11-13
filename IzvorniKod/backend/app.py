
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from main.controllers.users_controller import users_bp

app = Flask(__name__)

# Register the blueprint
app.register_blueprint(users_bp)

# define db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

db = SQLAlchemy(app)


if __name__ == '__main__':
    app.run(debug=True)