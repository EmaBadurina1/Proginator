from controllers.crud_template import *
from models import *
from auth import auth_validation

# setup blueprint
from flask import Blueprint
appointments_bp = Blueprint('appointments_bp', __name__)

# get list of appointments
@appointments_bp.route('/appointments', methods=['GET'])
#@auth_validation
def get_appointments():
    return get_all(Model=Appointment)

# get appointment with id=appointment_id
@appointments_bp.route('/appointments/<int:appointment_id>', methods=['GET'])
#@auth_validation
def get_appointment(appointment_id):
    return get_one(id=appointment_id, Model=Appointment)

# create new appointment
@appointments_bp.route('/appointments', methods=['POST'])
#@auth_validation
def create_appointment():
    required_fields = ['date_from', 'therapy_id']
    return create(required_fields=required_fields, Model=Appointment)

# update appointment with id=appointment_id
@appointments_bp.route('/appointments/<int:appointment_id>', methods=['PATCH'])
#@auth_validation
def update_appointment(appointment_id):
    return update(id=appointment_id, Model=Appointment)
    
# delete appointment with id=appointment_id
@appointments_bp.route('/appointments/<int:appointment_id>', methods=['DELETE'])
#@auth_validation
def delete_appointment(appointment_id):
    return delete(id=appointment_id, Model=Appointment)