from flask import Flask, request, jsonify, session
from models.accounts import User, Patient, Employee
from models.appointments import Appointment, Status
from models.therapies import Therapy, TherapyType
from models.devices import Device, DeviceType
from models.rooms import Room
from sqlalchemy.exc import SQLAlchemyError
from external_connector import get_patient_data
import auth, config
from db import db
from flask_cors import CORS
import os
from dotenv import load_dotenv
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app, supports_credentials=True)

load_dotenv()

# Construct the database URL
DB_URL = os.getenv("DB_URL")

app = Flask(__name__)
migrate = Migrate()

app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning

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
    
    # test if MBO exists in external database
    patient = get_patient_data(request.json['MBO'])
    if not patient:
        return jsonify({'error': 'MBO does not exist in external database'}), 400
    
    # test if patient data matches external database
    MBO_fields = ['name', 'surname', 'MBO', 'date_of_birth']
    for field in MBO_fields:
        if patient[field] != request.json[field]:
            return jsonify({'error': f'Patient data does not match external database: {field}'}), 400

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

# get list of appointments
@app.route('/appointments', methods=['GET'])
def get_appointments():
    #if 'user_id' in request.json: dodati filter za svakog korisnika

    appointments = Appointment.query.all()
    appointments_list = [appointment.to_dict() for appointment in appointments]
    return jsonify({"data": appointments_list, "message": "Appointments returned"}), 200

# update appointment content
@app.route('/appointments', methods=['PATCH'])
def update_appointment():
    if 'appointment_id' in request.json:
        appointment_id = request.json.get('appointment_id')
        appointment = Appointment.query.get(appointment_id)
        appointment.update_appointment(**request.json)

        db.session.commit()
        return jsonify({
            "appointment": appointment.to_dict(), 
            "message": "Appointment updated"
        }), 200
    else:
        return jsonify({
            'error': 'Appointment ID missing!'
        }), 400


# create new appointment
@app.route('/appointments', methods=['POST'])
def create_appointment():
    required_fields = ['date_from', 'therapy_id']
    missing_fields = validate_required_fields(request.json, required_fields)

    if missing_fields:
        error_message = f"Missing required fields: {', '.join(missing_fields)}"
        return jsonify({'error': error_message}), 400
    
    appointment = Appointment(**request.json)

    db.session.add(appointment)
    db.session.commit()

    return jsonify({"data":{'appointment_id': appointment.appointment_id}, 
                    "message": "Appointment created"}), 201


if __name__ == '__main__':
    db.init_app(app)
    # migrate.init_app(app, db)
    
    with app.app_context():
        db.create_all()
      
    app.run(debug=True)