from controllers.crud_template import *
from models import *
from auth import auth_validation, require_any_role
from datetime import datetime, timedelta
from sqlalchemy.orm import joinedload

# setup blueprint
from flask import Blueprint
appointments_bp = Blueprint('appointments_bp', __name__)

# get list of appointments
@appointments_bp.route('/appointments', methods=['GET'])
@auth_validation
@require_any_role('admin')
def get_appointments():
    return get_all(Model=Appointment, request=request)

# get appointment with id=appointment_id
@appointments_bp.route('/appointments/<int:appointment_id>', methods=['GET'])
@auth_validation
@require_any_role('admin', 'doctor', 'patient')
def get_appointment(appointment_id):
    return get_one(id=appointment_id, Model=Appointment)

# create new appointment
@appointments_bp.route('/appointments', methods=['POST'])
@auth_validation
@require_any_role('patient')
def create_appointment():
    required_fields = ['date_from', 'therapy_id']
    return create(required_fields=required_fields, Model=Appointment)

# update appointment with id=appointment_id
@appointments_bp.route('/appointments/<int:appointment_id>', methods=['PATCH'])
@auth_validation
@require_any_role('admin', 'patient')
def update_appointment(appointment_id):
    return update(id=appointment_id, Model=Appointment)
    
# delete appointment with id=appointment_id
@appointments_bp.route('/appointments/<int:appointment_id>', methods=['DELETE'])
@auth_validation
@require_any_role('admin', 'patient')
def delete_appointment(appointment_id):
    return delete(id=appointment_id, Model=Appointment)

# get list of appointments by therapy_id
@appointments_bp.route('/appointments/by-therapy/<int:therapy_id>', methods=['GET'])
@auth_validation
@require_any_role('admin', 'patient')
def get_by_therapy(therapy_id):
    try:
        page = request.args.get('page', default = 1, type = int)
        page_size = request.args.get('page_size', default = 20, type = int)

        if page_size > 20 or page_size < 1:
            return jsonify({
                "error": "Page size must be between 1 and 20",
                "status": 400
            }), 400

        appointments = (
            Appointment
            .query
            .filter_by(therapy_id=therapy_id)
            .paginate(page=page, per_page=page_size, error_out=False)
        )

        if appointments.pages == 0:
            return jsonify({
            "data": {
                "appointments": []
            },
            "page": 0,
            "page_size": page_size,
            "pages": appointments.pages,
            "status": 200,
            "elements": appointments.total
        }), 200

        if page > appointments.pages or page < 1:
            return jsonify({
                'error': 'Requested page does not exist',
                'status': 404
            }), 404

        return jsonify({
            "data": {
                "appointments": [appointment.to_dict() for appointment in appointments.items]
            },
            "page": page,
            "page_size": page_size,
            "pages": appointments.pages,
            "status": 200,
            "elements": appointments.total
        }), 200
    except Exception as e:
        return jsonify({
            "error": "Page and page size must be integers",
            "status": 400
        }), 400

# get list of appointments by patient
@appointments_bp.route('/appointments/by-patient/<int:user_id>', methods=['GET'])
@auth_validation
@require_any_role('admin', 'patient', 'doctor')
def get_by_patient(user_id):
    try:
        page = request.args.get('page', default = 1, type = int)
        page_size = request.args.get('page_size', default = 20, type = int)

        if page_size > 20 or page_size < 1:
            return jsonify({
                "error": "Page size must be between 1 and 20",
                "status": 400
            }), 400

        appointments = (
            Appointment
            .query
            .join(Therapy)
            .join(Patient)
            .filter(Patient.user_id == user_id)
            .options(joinedload(Appointment.therapy).joinedload(Therapy.patient))
            .paginate(page=page, per_page=page_size, error_out=False)
        )

        if appointments.pages == 0:
            return jsonify({
            "data": {
                "appointments": []
            },
            "page": 0,
            "page_size": page_size,
            "pages": appointments.pages,
            "status": 200,
            "elements": appointments.total
        }), 200

        if page > appointments.pages or page < 1:
            return jsonify({
                'error': 'Requested page does not exist',
                'status': 404
            }), 404

        return jsonify({
            "data": {
                "appointments": [appointment.to_dict() for appointment in appointments.items]
            },
            "page": page,
            "page_size": page_size,
            "pages": appointments.pages,
            "status": 200,
            "elements": appointments.total
        }), 200
    except Exception as e:
        return jsonify({
            "error": "Page and page size must be integers",
            "status": 400
        }), 400

# get list of appointments by employee
@appointments_bp.route('/appointments/by-employee/<int:user_id>', methods=['GET'])
@auth_validation
@require_any_role('doctor', 'admin')
def get_by_employee(user_id):
    try:
        page = request.args.get('page', default = 1, type = int)
        page_size = request.args.get('page_size', default = 20, type = int)

        if page_size > 20 or page_size < 1:
            return jsonify({
                "error": "Page size must be between 1 and 20",
                "status": 400
            }), 400

        appointments = (
            Appointment
            .query
            .filter_by(employee_id=user_id)
            .paginate(page=page, per_page=page_size, error_out=False)
        )

        if appointments.pages == 0:
            return jsonify({
            "data": {
                "appointments": []
            },
            "page": 0,
            "page_size": page_size,
            "pages": appointments.pages,
            "status": 200,
            "elements": appointments.total
        }), 200

        if page > appointments.pages or page < 1:
            return jsonify({
                'error': 'Requested page does not exist',
                'status': 404
            }), 404

        return jsonify({
            "data": {
                "appointments": [appointment.to_dict() for appointment in appointments.items]
            },
            "page": page,
            "page_size": page_size,
            "pages": appointments.pages,
            "status": 200,
            "elements": appointments.total
        }), 200
    except Exception as e:
        return jsonify({
            "error": "Page and page size must be integers",
            "status": 400
        }), 400
    
# get list of statuses
@appointments_bp.route('/statuses', methods=['GET'])
@auth_validation
@require_any_role('admin')
def get_statuses():
    return get_all(Model=Status, request=request)

# get status with id=status_id
@appointments_bp.route('/statuses/<int:status_id>', methods=['GET'])
@auth_validation
@require_any_role('admin')
def get_status(status_id):
    return get_one(id=status_id, Model=Status)

# create new status
@appointments_bp.route('/statuses', methods=['POST'])
@auth_validation
@require_any_role('admin')
def create_status():
    required_fields = ['status_name']
    return create(required_fields=required_fields, Model=Status)

# update status with id=status_id
@appointments_bp.route('/statuses/<int:status_id>', methods=['PATCH'])
@auth_validation
@require_any_role('admin')
def update_status(status_id):
    return update(id=status_id, Model=Status)
    
# delete status with id=status_id
@appointments_bp.route('/statuses/<int:status_id>', methods=['DELETE'])
@auth_validation
@require_any_role('admin')
def delete_status(status_id):
    return delete(id=status_id, Model=Status)