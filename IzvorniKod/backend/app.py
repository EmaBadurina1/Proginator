from flask import Flask, request, jsonify, session
from models.accounts import User, Patient, Employee
from sqlalchemy.exc import SQLAlchemyError
import auth, config
from db import db

app = Flask(__name__)

def validate_required_fields(data, required_fields):
    missing_fields = [field for field in required_fields if field not in data]
    return missing_fields

# Route to get a specific user by ID
@app.route('/users/<int:user_id>', methods=['GET'])
@auth.auth
def get_user(auth_user_id, user_id):
    try:
        employee = db.session.query(Employee).filter_by(user_id=user_id).first()
    except SQLAlchemyError as e:
        employee = None

    if employee:
        return jsonify({"data":{"employee": employee.to_dict()}, "message": "Employee returned"}), 200
    
    try:
        patient = db.session.query(Patient).filter_by(user_id=user_id).first()
    except SQLAlchemyError as e:
        patient = None
        
    if patient:
        return jsonify({"data":{"patient": patient.to_dict()}, "message": "Patient returned"}), 200
    
    user = db.session.query(User).filter_by(user_id=user_id).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({"data": {"user": user.to_dict()}, "message": "User returned"}), 200

# Route to get all users
@app.route('/users', methods=['GET'])
@auth.auth
def get_users(auth_user_id):
    users = User.query.all()
    user_list = [user.to_dict() for user in users]
    return jsonify({"data": user_list, "message": "Users returned"}), 200

# Route to create a new user
@app.route('/users', methods=['POST'])
def post_user():
    return jsonify({'message': 'Method not in use'}), 405

    required_fields = ['name', 'surname', 'email', 'phone_number', 'password']
    missing_fields = validate_required_fields(request.json, required_fields)

    if missing_fields:
        error_message = f"Missing required fields: {', '.join(missing_fields)}"
        return jsonify({'error': error_message}), 400
    
    user = User(**request.json)
    db.session.add(user)
    db.session.commit()
    return jsonify({"data":{'user_id': user.user_id}, 
                    "message": "User created"}), 201

@app.route('/login', methods=['POST'])
def login():
    user = User.query.filter_by(email=request.json['email']).first()
    if user and user.check_password(request.json['password']):

        # put token in session
        token = auth.generate_token(user.user_id)
        session['Authorization'] = token

        return jsonify({"data": {'user_id': user.user_id},
                        "message": "Login successful"}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401
    
# register patient
@app.route('/patients', methods=['POST'])
def register_patient():
    required_fields = ['name', 'surname', 'email', 'phone_number', 'date_of_birth', 'password', 'MBO']
    missing_fields = validate_required_fields(request.json, required_fields)

    if missing_fields:
        error_message = f"Missing required fields: {', '.join(missing_fields)}"
        return jsonify({'error': error_message}), 400
    
    # test for unique email, phone_number and MBO
    if User.query.filter_by(email=request.json['email']).first():
        return jsonify({'error': 'Unique attribute already exists: email'}), 400
    
    if User.query.filter_by(phone_number=request.json['phone_number']).first():
        return jsonify({'error': 'Unique attribute already exists: phone_number'}), 400
    
    if Patient.query.filter_by(MBO=request.json['MBO']).first():
        return jsonify({'error': 'Unique attribute already exists: MBO'}), 400

    patient = Patient(**request.json)
    db.session.add(patient)
    db.session.commit()
    return jsonify({"data":{'user_id': patient.user_id}, 
                    "message": "Patient created"}), 201

# register employee
@app.route('/employees', methods=['POST'])
def register_employee():
    required_fields = ['name', 'surname', 'email', 'phone_number', 'OIB', 'password', 'date_of_birth', 'is_active', 'is_admin']
    missing_fields = validate_required_fields(request.json, required_fields)

    if missing_fields:
        error_message = f"Missing required fields: {', '.join(missing_fields)}"
        return jsonify({'error': error_message}), 400
    
    # test for unique email and phone_number
    if User.query.filter_by(email=request.json['email']).first():
        return jsonify({'error': 'Unique attribute already exists: email'}), 400
    
    if User.query.filter_by(phone_number=request.json['phone_number']).first():
        return jsonify({'error': 'Unique attribute already exists: phone_number'}), 400
    
    if Employee.query.filter_by(OIB=request.json['OIB']).first():
        return jsonify({'error': 'Unique attribute already exists: OIB'}), 400
    

    employee = Employee(**request.json)
    db.session.add(employee)
    db.session.commit()
    return jsonify({"data":{'user_id': employee.user_id}, 
                    "message": "Employee created"}), 201


if __name__ == '__main__':
    app.config['SQLALCHEMY_DATABASE_URI'] = config.DATABASE_URI
    app.config['SECRET_KEY'] = config.SECRET_KEY

    db.init_app(app)

    with app.app_context():
        db.create_all()
        
    app.run(debug=True)
