from sqlalchemy.exc import SQLAlchemyError
from flask import request, jsonify

from models import *
from db import db
from auth import auth_validation

# setup blueprint
from flask import Blueprint
appointments_bp = Blueprint('appointments_bp', __name__)

def validate_required_fields(data, required_fields):
    missing_fields = [field for field in required_fields if field not in data]
    return missing_fields

# get list of appointments
@appointments_bp.route('/appointments', methods=['GET'])
@auth_validation
def get_appointments():
    appointments = Appointment.query.all()
    appointments_list = [appointment.to_dict() for appointment in appointments]
    return jsonify({"data": appointments_list, "message": "Appointments returned"}), 200

# update appointment content
@appointments_bp.route('/appointments', methods=['PATCH'])
@auth_validation
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
@appointments_bp.route('/appointments', methods=['POST'])
@auth_validation
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
