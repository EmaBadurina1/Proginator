from sqlalchemy.exc import SQLAlchemyError
from flask import request, jsonify, session
from db import db
from models import *
from auth import auth_validation
from external_connector import get_patient_data
from sqlalchemy.exc import IntegrityError, DataError
import re

# setup blueprint
from flask import Blueprint
accounts_bp = Blueprint('accounts_bp', __name__)

def validate_required_fields(data, required_fields):
    missing_fields = [field for field in required_fields if field not in data]
    return missing_fields

# check if required_fields are empty
def validate_empty_fields(data, required_fields):
    empty_fields = [field for field in required_fields if data[field] == ""]
    return empty_fields

# check if OIB or MBO is in right format
def validate_number(number, length):
    pattern = re.compile(r'^\d{' + str(length) + '}$')
    return bool(pattern.match(number))

# Route to get a specific user by ID
@accounts_bp.route('/users/<int:user_id>', methods=['GET'])
@auth_validation
def get_user(user_id):
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

# get all users
@accounts_bp.route('/users', methods=['GET'])
@auth_validation
def get_users():
    data = {
        "users": {
            "patients": [],
            "employees": []
        },
        "message": "Dohvaćeni svi korisnici."
    }
    patients = Patient.query.all()
    for patient in patients:
        data["users"]["patients"].append(patient.to_dict())
    
    employees = Employee.query.all()
    for employee in employees:
        data["users"]["employees"].append(employee.to_dict())

    return jsonify(data), 200
                    
@accounts_bp.route('/login', methods=['POST'])
def login():
    user: User = User.query.filter_by(email=request.json['email']).first()
    if user and user.check_password(request.json['password']):
        session['user_id'] = user.user_id
        print(session['user_id'])
        response = jsonify({"data": {'user_id': user.user_id},
                            "message": "Login successful"})

        response.status_code = 200
        return response
    else:
        return jsonify({'error': 'Invalid username or password'}), 401
    

@accounts_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logout successful"}), 200
    
# register patient
@accounts_bp.route('/patients', methods=['POST'])
def register_patient():
    required_fields = [
        'name',
        'surname',
        'email',
        'phone_number',
        'date_of_birth',
        'password',
        'MBO'
    ]
    missing_fields = validate_required_fields(request.json, required_fields)

    # check if there are all required fields
    if missing_fields:
        error_message = f"Nedostaju obavezna polja: {', '.join(missing_fields)}"
        return jsonify({'error': error_message}), 400
    
    empty_fields = validate_empty_fields(request.json, required_fields)

    # check if required_fields are empty
    if empty_fields:
        error_message = f"Obavezna polja ne smiju biti prazna: {', '.join(empty_fields)}"
        return jsonify({'error': error_message}), 400

    # check is MBO is in right format
    if not validate_number(request.json['MBO'], 9):
        return jsonify({
            'error': 'MBO mora biti 9 znamenki.'
        }), 400

    email = request.json['email']
    phone_number = request.json['phone_number']
    MBO = request.json['MBO']

    query_patient = Patient.query.filter((Patient.email == email) | 
                                         (Patient.phone_number == phone_number) | 
                                         (Patient.MBO == MBO)).first()
    
    if query_patient:
        duplicate_params = []
        if query_patient.email == email:
            duplicate_params.append("email")
        if query_patient.phone_number == phone_number:
            duplicate_params.append("phone_number")
        if query_patient.MBO == MBO:
            duplicate_params.append("MBO")

        error_message = f"Podatci koje pokušavate unijeti trebaju biti jedinstveni, a oni već postoje: {', '.join(duplicate_params)}"
        return jsonify({'error': error_message}), 400
    
    # test if MBO exists in external database
    patient = get_patient_data(request.json['MBO'])
    if not patient:
        return jsonify({'error': 'MBO nije evidentiran u vanjskoj bazi podataka.'}), 400
    
    # test if patient data matches external database
    MBO_fields = [
        'name',
        'surname',
        'MBO',
        'date_of_birth'
    ]
    for field in MBO_fields:
        if patient[field] != request.json[field]:
            return jsonify({
                'error': f'Uneseni podatci se ne podudaraju sa podatcima iz vanjske baze podataka.'
            }), 400

    data = {}
    for key in required_fields:
        data[key] = request.json[key]

    try:
        patient = Patient(**data)
        db.session.add(patient)
        db.session.commit()
        message = "Uspješno dodan pacijent " + patient.name + " " + patient.surname
        return jsonify({
            "data": {
                "patient": patient.to_dict()
            }, 
            "message": message
        }), 201
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({
            'error': "Podatci koje pokušavate unijeti trebaju biti jedinstveni, a oni već postoje."
        }), 400
    except DataError as e:
        db.session.rollback()
        return jsonify({
            'error': "Podatci koje pokušavate unijeti nisu u valjanom formatu."
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': "Dogodila se pogreška prilikom unosa."
        }), 500
    finally:
        db.session.close()

# register employee
@accounts_bp.route('/employees', methods=['POST'])
def register_employee():
    required_fields = [
        'name',
        'surname',
        'email',
        'phone_number',
        'OIB',
        'password',
        'date_of_birth',
        'is_active',
        'is_admin'
    ]

    # check if there are all required fields
    missing_fields = validate_required_fields(request.json, required_fields)
    if missing_fields:
        error_message = f"Nedostaju obavezna polja: {', '.join(missing_fields)}"
        return jsonify({'error': error_message}), 400
    
    # check if required_fields are empty
    empty_fields = validate_empty_fields(request.json, required_fields)
    if empty_fields:
        error_message = f"Obavezna polja ne smiju biti prazna: {', '.join(empty_fields)}"
        return jsonify({'error': error_message}), 400

    # check if OIB is in right format
    if not validate_number(request.json['OIB'], 11):
        return jsonify({
            'error': 'OIB mora imati 11 znamenki.'
        }), 400
    
    email = request.json['email']
    phone_number = request.json['phone_number']
    OIB = request.json['OIB']

    query_patient = Employee.query.filter((Employee.email == email) | 
                                         (Employee.phone_number == phone_number) | 
                                         (Employee.OIB == OIB)).first()
    
    if query_patient:
        duplicate_params = []
        if query_patient.email == email:
            duplicate_params.append("email")
        if query_patient.phone_number == phone_number:
            duplicate_params.append("phone_number")
        if query_patient.MBO == OIB:
            duplicate_params.append("OIB")

        error_message = f"Podatci koje pokušavate unijeti trebaju biti jedinstveni, a oni već postoje: {', '.join(duplicate_params)}"
        return jsonify({'error': error_message}), 400
    
    data = {}
    for key in required_fields:
        data[key] = request.json[key]

    try:
        employee = Employee(**data)
        db.session.add(employee)
        db.session.commit()
        message = "Uspješno dodan djelatnik " + employee.name + " " + employee.surname
        return jsonify({
            "data": {
                "employee": employee.to_dict()
            },
            "message": message
        }), 201
    
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({
            'error': "Podatci koje pokušavate unijeti trebaju biti jedinstveni, a oni već postoje."
        }), 400
    except DataError as e:
        db.session.rollback()
        return jsonify({
            'error': "Podatci koje pokušavate unijeti nisu u valjanom formatu."
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': "Dogodila se pogreška prilikom unosa."
        }), 500
    finally:
        db.session.close()

@accounts_bp.route('/users/<int:user_id>/password', methods=['PATCH'])
@auth_validation
def change_password(user_id):
    required_fields = [
        "old_password",
        "new_password",
        "new_password_rep"
    ]

    missing_fields = validate_required_fields(request.json, required_fields)
    if missing_fields:
        error_message = f"Missing fields: {', '.join(missing_fields)}"
        return jsonify({
            "error": error_message,
            "status": 400
        }), 400
    
    if request.json["new_password"] != request.json["new_password_rep"]:
        return jsonify({
            "error": "Passwords are not the same",
            "status": 400
        }), 400
    
    user = User.query.get(id);

    if not user.check_password(request.json["password"]):
        return jsonify({
            "error": "Wrong password",
            "status": 400
        }), 400
    
    user.change_password(request.json["new_password"])
    db.session.commit()

    return jsonify({
        "message": "Password changed",
        "status": 200
    }), 200

"""
# adding new user
@accounts_bp.route('/users', methods=['POST'])
def add_user():
    required_fields = [
        'name',
        'surname',
        'email',
        'phone_number',
        'password',
        'date_of_birth',
        'role'
    ]

    if 'role' not in request.json:
        error_message = "There is no key named role in request."
        return jsonify({'error': error_message}), 400
    elif request.json['role'] == "":
        error_message = "Role is not defined."
        return jsonify({'error': error_message}), 400
    else:
        if request.json['role'] == "patient":
            required_fields.append("MBO")
        elif request.json['role'] == "admin" or request.json['role'] == "doctor":
            required_fields.append("OIB")

    missing_fields = validate_required_fields(request.json, required_fields)

    if missing_fields:
        error_message = f"Missing required fields: {', '.join(missing_fields)}"
        return jsonify({'error': error_message}), 400
    
    empty_fields = validate_empty_fields(request.json, required_fields)

    if empty_fields:
        error_message = f"Required fields can not be empty: {', '.join(empty_fields)}"
        return jsonify({'error': error_message}), 400

    if User.query.filter_by(email=request.json['email']).first():
        return jsonify({'error': 'Unique attribute already exists: email'}), 400

    if User.query.filter_by(phone_number=request.json['phone_number']).first():
        return jsonify({'error': 'Unique attribute already exists: phone_number'}), 400
    
    role = request.json['role']
    data = {}
    for key in required_fields:
        data[key] = request.json[key]
    data.pop("role", None)

    if role == "patient":
        if len(request.json['MBO']) != 9:
            return jsonify({'error': 'MBO must have 9 characters.'}), 400

        if Employee.query.filter_by(MBO=request.json['MBO']).first():
            return jsonify({'error': 'Unique attribute already exists: MBO'}), 400

        patient = Patient(**data)
        db.session.add(patient)
        db.session.commit()
        return jsonify({
            "data": patient.to_dict(), 
            "message": "Patient created"
        }), 201

    elif role == "doctor" or role == "admin":
        if len(request.json['OIB']) != 11:
            return jsonify({'error': 'OIB must have 11 characters.'}), 400

        if Employee.query.filter_by(OIB=request.json['OIB']).first():
            return jsonify({'error': 'Unique attribute already exists: OIB'}), 400

        if role == "doctor":
            data["is_active"] = True
            data["is_admin"] = False
        if role == "admin":
            data["is_active"] = True
            data["is_admin"] = True

        employee = Employee(**data)
        db.session.add(employee)
        db.session.commit()
        return jsonify({
            "data": employee.to_dict(), 
            "message": "Employee created"
        }), 201
    else:
        error_message = f"There is no role '{request.json['role']}'."
        return jsonify({'error': error_message}), 400
"""