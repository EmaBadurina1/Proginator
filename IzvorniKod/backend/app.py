
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from main.controllers import tasks_bp

app = Flask(__name__)

# Register the blueprint
app.register_blueprint(tasks_bp)

# define db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'

db = SQLAlchemy(app)

if __name__ == '__main__':
    app.run(debug=True)