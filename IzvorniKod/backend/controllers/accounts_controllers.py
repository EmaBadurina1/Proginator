from db import db
from models import *
from auth import auth_validation, require_role
from external_connector import get_patient_data
from sqlalchemy.exc import IntegrityError, DataError
from utils.utils import *
from .crud_template import *
 
# setup blueprint
from flask import Blueprint
accounts_bp = Blueprint('accounts_bp', __name__)

# get list of users by page
@accounts_bp.route('/users', methods=['GET'])
@auth_validation
@require_role("admin")
def get_users():
    """
    page = 1
    page_size = 20 # max page size is 20 elements
    print(1)
    try:
        if "page" in request.json:
            page = int(request.json["page"])
        if "page_size" in request.json:
            size = int(request.json["page_size"])
        if size <= 20:
            page_size = size
    except ValueError:
        return jsonify({
            "error": "Page and page size must be integers",
            "status": 400
        }), 400
    print(2)
    users = User.query.paginate(page=page, max_per_page=page_size, error_out=False)
    if page > users.pages or page < 1:
        return jsonify({
            'error': 'Requested page does not exist',
            'status': 404
        }), 404

    print(3)
    patients = []
    employees = []
    
    for user in users.items:
        print(user)
        if user.role == "patient":
            patient = Patient.query.get(user.user_id)
            patients.append(patient.to_dict())
        else:
            employee = Employee.query.get(user.user_id)
            employees.append(employee.to_dict())
    print(4)
    return jsonify({
        "data": {
            "patients": patients,
            "employees": employees,
            "page": page,
            "page_size": page_size,
            "pages": users.pages
        },
        "status": 200
    }), 200
    """
    patients = []
    for patient in Patient.query.all():
        patients.append(patient.to_dict())
    
    employees = []
    for employee in Employee.query.all():
        employees.append(employee.to_dict())

    return jsonify({
        "data": {
            "patients": patients,
            "employees": employees
        },
        "status": 200
    }), 200

# create new patient
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
            "error": f"Required fields cannot be empty: {', '.join(empty_fields)}",
            "status": 400
        }), 400

    # check is MBO is in right format
    if not validate_number(request.json['MBO'], 9):
        return jsonify({
            "error": "MBO must be 9 characters long",
            "status": 400
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

        return jsonify({
            "error": f"Data is not unique: {', '.join(duplicate_params)}",
            "status": 400
        }), 400
    
    # test if MBO exists in external database
    patient = get_patient_data(request.json['MBO'])
    if not patient:
        return jsonify({
            "error": f"MBO: {request.json['MBO']} does not exist",
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
                "error": "Data is not correct",
                "status": 400
            }), 400

    data = {}
    for key in required_fields:
        data[key] = request.json[key]

    try:
        patient = Patient(**data)
        db.session.add(patient)
        db.session.commit()
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
            "error": "Data is not unique",
            "status": 400
        }), 400
    except DataError as e:
        db.session.rollback()
        return jsonify({
            "error": "Invalid data format",
            "status": 400
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "There was an error with storing your data",
            "status": 500
        }), 500
    finally:
        db.session.close()

# get list of all patients
@accounts_bp.route('/patients', methods=['GET'])
@auth_validation
def get_patients():
    return get_all(Model=Patient)

# get patient with id=user_id
@accounts_bp.route('/patients/<int:user_id>', methods=['GET'])
@auth_validation
def get_patient(user_id):
    return get_one(id=user_id, Model=Patient)

# update patient with id=user_id
@accounts_bp.route('/patients/<int:user_id>', methods=['PATCH'])
@auth_validation
def update_patient(user_id):
    patient = Patient.query.get(user_id)
    if patient:
        MBO = patient.MBO
        if 'MBO' in request.json:
            MBO = request.json['MBO']

        patient_external = get_patient_data(MBO)
        
        # test if patient data matches external database
        MBO_fields = []
        if 'name' in request.json:
            MBO_fields.append('name')
        if 'surname' in request.json:
            MBO_fields.append('surname')
        if 'MBO' in request.json:
            MBO_fields.append('MBO')
        if 'date_of_birth' in request.json:
            MBO_fields.append('date_of_birth')
        
        for field in MBO_fields:
            if patient_external[field] != request.json[field]:
                return jsonify({
                    "error": f"Data is not correct. Expected: {patient_external[field]} Given: {request.json[field]}",
                    "status": 400
                }), 400

        try:
            patient.update(**request.json)
            db.session.commit()
        except (ValueError, IntegrityError, DataError) as e:
            db.session.rollback()
            return jsonify({
                "error": f"Invalid input: {str(e)}",
                "status": 400
            }), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({
                "error": "There was a problem storing your data",
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
            "error": f"No ID: {id}",
            "status": 404
        }), 404

# delete patient with id=user_id
@accounts_bp.route('/patients/<int:user_id>', methods=['DELETE'])
@auth_validation
def delete_patient(user_id):
    patient = Patient.query.get(user_id)

    if patient:
        db.session.delete(patient)
        db.session.commit()
        return jsonify({
            "message": "Deleted",
            "status": 200
        }), 200
    else:
        return jsonify({
            "error": f"No ID: {user_id}",
            "status": 404
        }), 404

# create new employee
@accounts_bp.route('/employees', methods=['POST'])
@auth_validation
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
            "error": f"Required fields cannot be empty: {', '.join(empty_fields)}",
            "status": 400
        }), 400

    # check if OIB is in right format
    if not validate_number(request.json['OIB'], 11):
        return jsonify({
            "error": "OIB must be 9 characters long",
            "status": 400
        }), 400
    
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
        if query_employee.MBO == OIB:
            duplicate_params.append("OIB")

        return jsonify({
            "error": f"Data is not unique: {', '.join(duplicate_params)}",
            "status": 400
        }), 400
    
    data = {}
    for key in required_fields:
        data[key] = request.json[key]

    try:
        employee = Employee(**data)
        db.session.add(employee)
        db.session.commit()
        return jsonify({
            "data": {
                "employee": employee.to_dict()
            }, 
            "message": f"Employee added: {employee.name} {employee.surname}",
            "status": 201
        }), 201
    
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({
            "error": "Data is not unique",
            "status": 400
        }), 400
    except DataError as e:
        db.session.rollback()
        return jsonify({
            "error": "Invalid data format",
            "status": 400
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "There was an error with storing your data",
            "status": 500
        }), 500
    finally:
        db.session.close()

# get list of all employees
@accounts_bp.route('/employees', methods=['GET'])
@auth_validation
def get_employees():
    return get_all(Model=Employee)

# get employee with id=user_id
@accounts_bp.route('/employees/<int:user_id>', methods=['GET'])
@auth_validation
def get_employee(user_id):
    return get_one(id=user_id, Model=Employee)

# update employee with id=user_id
@accounts_bp.route('/employees/<int:user_id>', methods=['PATCH'])
@auth_validation
def update_employee(user_id):
    return update(id=user_id, Model=Employee)

# delete employee with id=user_id
@accounts_bp.route('/employees/<int:user_id>', methods=['DELETE'])
@auth_validation
def delete_employee(user_id):
    employee = Employee.query.get(user_id)

    if employee:
        db.session.delete(employee)
        db.session.commit()
        return jsonify({
            "message": "Deleted",
            "status": 200
        }), 200
    else:
        return jsonify({
            "error": f"No ID: {user_id}",
            "status": 404
        }), 404