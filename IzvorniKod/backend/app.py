from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'  # Use an SQLite database
db = SQLAlchemy(app)

# Define the User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    surname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    hashed_password = db.Column(db.String(80), nullable=False)
    phone_number = db.Column(db.String(80), unique=True, nullable=False)

    def __init__(self, name, surname, email, phone_number, password):
        self.name = name
        self.surname = surname
        self.email = email
        self.phone_number = phone_number
        self.set_password(password)

    def __repr__(self):
        return f'<User {self.username}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'surname': self.surname,
            'email': self.email,
            'phone_number': self.phone_number,
            'hashed_password': self.hashed_password
        }
    
    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)

# Create the database tables inside a Flask app context
with app.app_context():
    db.create_all()


def validate_required_fields(data, required_fields):
    missing_fields = [field for field in required_fields if field not in data]
    return missing_fields

# Route to get a specific user by ID
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    return jsonify(user.to_dict())

# Route to get all users
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = [user.to_dict() for user in users]
    return jsonify({'users': user_list})

# Route to create a new user
@app.route('/users', methods=['POST'])
def post_user():
    required_fields = ['name', 'surname', 'email', 'phone_number', 'password']
    missing_fields = validate_required_fields(request.json, required_fields)

    if missing_fields:
        error_message = f"Missing required fields: {', '.join(missing_fields)}"
        return jsonify({'error': error_message}), 400
    
    user = User(**request.json)
    db.session.add(user)
    db.session.commit()
    return jsonify({'id': user.id})

# login
@app.route('/login', methods=['POST'])
def login():
    user = User.query.filter_by(email=request.json['email']).first()
    if user and user.check_password(request.json['password']):
        return jsonify({'user_id': user.id}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

if __name__ == '__main__':
    app.run(debug=True)


'''
write documentation for the API endpoints:

root = /

GET /users
    - returns a list of all users
    - returns a 200 status code

POST /users
    - expects a JSON object with the following fields:
        - name
        - surname
        - email
        - phone_number
        - password

    - creates a new user
    - returns the ID of the newly created user
    - returns a 400 if any of the required fields are missing

GET /users/<user_id>
    - returns info for specific user
    - returns a 404 if the user doesn't exist

'''
