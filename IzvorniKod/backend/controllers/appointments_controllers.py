from controllers.crud_template import *
from models import *
from auth import auth_validation
from datetime import datetime, timedelta

# setup blueprint
from flask import Blueprint
appointments_bp = Blueprint('appointments_bp', __name__)

# get list of appointments
@appointments_bp.route('/appointments', methods=['GET'])
@auth_validation
def get_appointments():
    return get_all(Model=Appointment)

# get appointment with id=appointment_id
@appointments_bp.route('/appointments/<int:appointment_id>', methods=['GET'])
@auth_validation
def get_appointment(appointment_id):
    return get_one(id=appointment_id, Model=Appointment)

# create new appointment
@appointments_bp.route('/appointments', methods=['POST'])
@auth_validation
def create_appointment():
    required_fields = ['date_from', 'therapy_id']
    return create(required_fields=required_fields, Model=Appointment)

# update appointment with id=appointment_id
@appointments_bp.route('/appointments/<int:appointment_id>', methods=['PATCH'])
@auth_validation
def update_appointment(appointment_id):
    return update(id=appointment_id, Model=Appointment)
    
# delete appointment with id=appointment_id
@appointments_bp.route('/appointments/<int:appointment_id>', methods=['DELETE'])
@auth_validation
def delete_appointment(appointment_id):
    return delete(id=appointment_id, Model=Appointment)

# get list of appointments by therapy_id
@appointments_bp.route('/appointments/by-therapy/<int:therapy_id>', methods=['GET'])
@auth_validation
def get_by_therapy(therapy_id):
    appointments = Appointment.query.filter_by(therapy_id=therapy_id).all()
    list = [appointment.to_dict() for appointment in appointments]
    return jsonify({
        "data": {
            "appointments": list
        },
        "status": 200
    }), 200

# get list of appointments by employee
@appointments_bp.route('/appointments/by-employee/<int:user_id>', methods=['GET'])
@auth_validation
def get_by_employee(user_id):
    appointments = Appointment.query.filter_by(employee_id=user_id).all()
    list = [appointment.to_dict() for appointment in appointments]
    return jsonify({
        "data": {
            "appointments": list
        },
        "status": 200
    }), 200

"""
# get list of appointments by date and room
@appointments_bp.route('/appointments/by-room-date/<string:date>/<string:room_num>', methods=['GET'])
@auth_validation
def get_by_room(date, room_num):
    try:
        target_date = datetime.strptime(date, '%Y-%m-%d')
    except ValueError:
        return jsonify({
            "error": "Invalid date format. Please use the format 'YYYY-MM-DD'.",
            "status": 400
        }), 400

    appointments = Appointment.query.filter(
        Appointment.date_from >= target_date,
        Appointment.date_from < target_date + timedelta(days=1),
        Appointment.room_num == room_num
    ).all()
    list = [appointment.to_dict() for appointment in appointments]
    return jsonify({
        "data": {
            "appointments": list
        },
        "status": 200
    }), 200
"""
    
# get list of statuses
@appointments_bp.route('/statuses', methods=['GET'])
@auth_validation
def get_statuses():
    return get_all(Model=Status)

# get status with id=status_id
@appointments_bp.route('/statuses/<int:status_id>', methods=['GET'])
@auth_validation
def get_status(status_id):
    return get_one(id=status_id, Model=Status)

# create new status
@appointments_bp.route('/statuses', methods=['POST'])
@auth_validation
def create_status():
    required_fields = ['status_name']
    return create(required_fields=required_fields, Model=Status)

# update status with id=status_id
@appointments_bp.route('/statuses/<int:status_id>', methods=['PATCH'])
@auth_validation
def update_status(status_id):
    return update(id=status_id, Model=Status)
    
# delete status with id=status_id
@appointments_bp.route('/statuses/<int:status_id>', methods=['DELETE'])
@auth_validation
def delete_status(status_id):
    return delete(id=status_id, Model=Status)