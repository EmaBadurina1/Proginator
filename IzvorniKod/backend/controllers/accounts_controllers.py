from db import db
from models import *
from auth import auth_validation, require_any_role
from external_connector import get_doctor_from_external_db, get_patient_data, get_doctors_from_external_db
from sqlalchemy.exc import IntegrityError, DataError
from utils.utils import *
from .crud_template import *
from flask import request, jsonify, session
from sqlalchemy import and_
from datetime import datetime
from dotenv import load_dotenv
from mail import mail
from flask_mail import Message
import os

# setup blueprint
from flask import Blueprint
accounts_bp = Blueprint('accounts_bp', __name__)

# get list of all patients
@accounts_bp.route('/patients', methods=['GET'])
@auth_validation
@require_any_role("admin", "doctor")
def get_patients():
    return get_all(Model=Patient, request=request)

# get patient with id=user_id
@accounts_bp.route('/patients/<int:user_id>', methods=['GET'])
@auth_validation
def get_patient(user_id):
    # patient can only get his own data
    if session['role'] == 'patient' and session['user_id'] != user_id:
        return jsonify({
            "error": "You don't have permission to access this data",
            "status": 403
        }), 403
    
    return get_one(id=user_id, Model=Patient)

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
        return jsonify({
            "error": f"Missing required fields: {', '.join(missing_fields)}",
            "status": 400
        }), 400
    
    empty_fields = validate_empty_fields(request.json, required_fields)

    # check if required_fields are empty
    if empty_fields:
        return jsonify({
            "error": f"Sljedeći parametri ne smiju biti prazni: {', '.join(empty_fields)}",
            "status": 400
        }), 400

    # check if is MBO is in right format
    if not validate_number(request.json['MBO'], 9):
        return jsonify({
            "error": "MBO mora biti 9 znamenki dugačak",
            "status": 400
        }), 400

    email = request.json['email']
    phone_number = request.json['phone_number']
    MBO = request.json['MBO']
    date_of_birth = datetime.strptime(request.json['date_of_birth'], '%Y-%m-%d').date()
    name = request.json['name']
    surname = request.json['surname']

    not_confirmed = Patient.query.filter(
        and_(
            Patient.MBO == MBO,
            Patient.date_of_birth == date_of_birth,
            Patient.name == name,
            Patient.surname == surname,
            Patient.confirmed == False
        )
    ).first()

    load_dotenv()

    token = generate_token(email=email)
    url = os.getenv("FRONTEND_URL")
    url = url + "/confirm-email/" + token
    msg = Message(
        'E-mail verifikacija - RehApp',
        sender='proginator@fastmail.com',
        recipients=[email]
    )
    msg.body = "Za verifikaciju računa kliknite na poveznicu: " + url

    if not_confirmed:
        not_confirmed.phone_number = phone_number
        not_confirmed.email = email
        not_confirmed_user = User.query.get(not_confirmed.user_id)
        not_confirmed_user.set_password(request.json['password'])
        db.session.commit()
        mail.send(msg)
        return jsonify({
            "data": {
                "patient": not_confirmed.to_dict()
            }, 
            "message": f"Korisnik postoji, ali nije registriran",
            "status": 200
        }), 200

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

        return jsonify({
            "error": f"Sljedeći podaci su već zauzeti: {', '.join(duplicate_params)}",
            "status": 400
        }), 400
    
    # test if MBO exists in external database
    patient = get_patient_data(request.json['MBO'])
    if not patient:
        return jsonify({
            "error": f"MBO nije važeći",
            "status": 400
        }), 400
    
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
                "error": "Podaci nisu ispravni: MBO ne odgovara ostalim podacima",
                "status": 400
            }), 400

    data = {}
    for key in required_fields:
        data[key] = request.json[key]

    try:
        patient = Patient(**data)
        db.session.add(patient)
        db.session.commit()
        mail.send(msg)
        return jsonify({
            "data": {
                "patient": patient.to_dict()
            }, 
            "message": f"Patient added: {patient.name} {patient.surname}",
            "status": 201
        }), 201
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({
            "error": "Podaci nisu jedinstveni",
            "status": 400
        }), 400
    except DataError as e:
        db.session.rollback()
        return jsonify({
            "error": "Neispravan format podataka",
            "status": 400
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Došlo je do pogreške prilikom spremanja podataka",
            "status": 500
        }), 500
    finally:
        db.session.close()

# update patient with id=user_id
@accounts_bp.route('/patients/<int:user_id>', methods=['PATCH'])
@auth_validation
@require_any_role("admin", "patient")
def update_patient(user_id):
    # patient can only update his own data || BILO BI DOBRO DA SE OVO RIJEŠI U AUTH VALIDATION
    if session['role'] == 'patient' and session['user_id'] != user_id:
        return jsonify({
            "error": "Nemate pravo pristupa ovim podacima",
            "status": 403
        }), 403
    
    patient = Patient.query.get(user_id)

    # patient is not found
    if not patient:
        return jsonify({
            "error": f"Pacijent nije pronađen",
            "status": 404
        }), 404
    
    update_fields = {}

    if 'email' in request.json:
        update_fields['email'] = request.json['email']
    if 'phone_number' in request.json:
        update_fields['phone_number'] = request.json['phone_number']

    # check if there are any fields to update
    if not update_fields:
        return jsonify({
            "error": "Nema podataka za ažuriranje",
            "status": 400
        }), 400
    
    #update(id=user_id, Model=Patient)
    patient = Patient.query.get(user_id)
    if patient:
        try:
            patient.update(**request.json)
            db.session.commit()
        except (ValueError, IntegrityError, DataError) as e:
            db.session.rollback()
            return jsonify({
                "error": f"Podaci su neispravni: {e}",
                "status": 400
            }), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({
                "error": "Došlo je do pogreške prilikom spremanja podataka",
                "status": 500
            }), 500
        return jsonify({
            "data": {
                "patient": patient.to_dict()
            },
            "status": 200
        }), 200
    else:
        return jsonify({
            "error": f"Nepostojeći ID: {user_id}",
            "status": 404
        }), 404

# delete patient with id=user_id
@accounts_bp.route('/patients/<int:user_id>', methods=['DELETE'])
@auth_validation
@require_any_role("admin")
def delete_patient(user_id):
    patient = Patient.query.get(user_id)

    if patient:
        db.session.delete(patient) # would be better to set is_active=False
        db.session.commit()
        return jsonify({
            "message": "Pacijent izbrisan",
            "status": 200
        }), 200
    else:
        return jsonify({
            "error": f"Pacijent nije pronađen",
            "status": 404
        }), 404

# get list of all employees
@accounts_bp.route('/employees', methods=['GET'])
@auth_validation
@require_any_role("admin")
def get_employees():
    return get_all(Model=Employee, request=request)

# get employee with id=user_id
@accounts_bp.route('/employees/<int:user_id>', methods=['GET'])
@auth_validation
@require_any_role("admin", "doctor")
def get_employee(user_id):
    return get_one(id=user_id, Model=Employee)

# create new employee
@accounts_bp.route('/employees', methods=['POST'])
@auth_validation
@require_any_role("admin")
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

    missing_fields = validate_required_fields(request.json, required_fields)
    
    # check if there are all required fields
    if missing_fields:
        return jsonify({
            "error": f"Missing required fields: {', '.join(missing_fields)}",
            "status": 400
        }), 400
    
    empty_fields = validate_empty_fields(request.json, required_fields)

    # check if required_fields are empty
    if empty_fields:
        return jsonify({
            "error": f"Sljedeći parametri ne smiju biti prazni: {', '.join(empty_fields)}",
            "status": 400
        }), 400

    # check if OIB is in right format
    if not validate_number(request.json['OIB'], 11):
        return jsonify({
            "error": "OIB mora imati 11 znamenki",
            "status": 400
        }), 400
    
    # check if email, phone_number or OIB are already in use
    email = request.json['email']
    phone_number = request.json['phone_number']
    OIB = request.json['OIB']

    query_employee = Employee.query.filter((Employee.email == email) | 
                                         (Employee.phone_number == phone_number) | 
                                         (Employee.OIB == OIB)).first()
    
    if query_employee:
        duplicate_params = []
        if query_employee.email == email:
            duplicate_params.append("email")
        if query_employee.phone_number == phone_number:
            duplicate_params.append("phone_number")
        if query_employee.OIB == OIB:
            duplicate_params.append("OIB")

        return jsonify({
            "error": f"Sljedeći podaci su već zauzeti: {', '.join(duplicate_params)}",
            "status": 400
        }), 400
    
    data = {}
    for key in required_fields:
        data[key] = request.json[key]

    #create(required_fields=required_fields, Model=Employee)

    missing_fields = validate_required_fields(request.json, required_fields)

    if missing_fields:
        error_message = f"Missing fields: {', '.join(missing_fields)}"
        return jsonify({
            "error": error_message,
            "status": 400
        }), 400
    
    employee = Employee(**request.json)

    try:
        db.session.add(employee)
        db.session.commit()
        return jsonify({
            "data": {
                "employee": employee.to_dict()
            },
            "status": 201
        }), 201
    except (ValueError, IntegrityError, DataError) as e:
        db.session.rollback()
        print(e)
        return jsonify({
            "error": "Podaci su neispravni",
            "status": 400
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Došlo je do pogreške prilikom spremanja podataka",
            "status": 500
        }), 500

# update employee with id=user_id
@accounts_bp.route('/employees/<int:user_id>', methods=['PATCH'])
@auth_validation
@require_any_role("admin", "doctor")
def update_employee(user_id):
    # doctor can only update his own data
    if session['role'] == 'doctor' and session['user_id'] != user_id:
        return jsonify({
            "error": "Nemate pravo pristupa ovim podacima",
            "status": 403
        }), 403
    
    return update(id=user_id, Model=Employee)

# delete employee with id=user_id
@accounts_bp.route('/employees/<int:user_id>', methods=['DELETE'])
@auth_validation
@require_any_role("admin")
def delete_employee(user_id):
    employee = Employee.query.get(user_id)

    if not employee:
        return jsonify({
            "error": f"Zaposlenik nije pronađen",
            "status": 404
        }), 404
        
    db.session.delete(employee)
    db.session.commit()
    return jsonify({
        "message": "Zaposlenik izbrisan",
        "status": 200
    }), 200
        
    
@accounts_bp.route('/doctors', methods=['GET'])
@auth_validation
@require_any_role("admin", "doctor", "patient")
def get_doctors():
    try:
        doctors = get_doctors_from_external_db()
        return jsonify({
            "data": {
                "doctors": doctors
            },
            "status": 200
        }), 200
    except Exception as e:
        return jsonify({
            "error": "Došlo je do pogreške prilikom dohvaćanja podataka" + str(e),
            "status": 500
        }), 500

@accounts_bp.route('/doctors/<int:doctor_id>', methods=['GET'])
@auth_validation
@require_any_role("admin", "doctor", "patient")
def get_doctor(doctor_id):
    try:
        doctor = get_doctor_from_external_db(doctor_id)
        return jsonify({
            "data": {
                "doctor": doctor
            },
            "status": 200
        }), 200
    except Exception as e:
        return jsonify({
            "error": "Došlo je do pogreške prilikom dohvaćanja podataka",
            "status": 500
        }), 500