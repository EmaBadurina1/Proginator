from sqlalchemy import and_, not_, or_
from controllers.crud_template import *
from models import *
from auth import auth_validation, require_any_role
from sqlalchemy.orm import joinedload
import psycopg2
from flask import request, jsonify, session
from db import db

from utils.appointments_util import appointment_overlapping

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
    missing_fields = validate_required_fields(request.json, required_fields)

    if missing_fields:
        error_message = f"Nedostajuća polja: {', '.join(missing_fields)}"
        return jsonify({
            "error": error_message,
            "status": 400
        }), 400

    # get patient and duration from therapy with database session
    patient_id = db.session.query(Therapy.patient_id).filter_by(therapy_id=request.json['therapy_id']).first().patient_id

    # patient can only create his appointments
    if session['role'] == 'patient' and patient_id != session['user_id']:
        return jsonify({
            "error": "Forbidden",
            "status": 403
        }), 403
    
    # check if appointment is in the past
    if datetime.strptime(request.json['date_from'], '%Y-%m-%d %H:%M') < datetime.now():
        return jsonify({
            "error": "Termin ne može biti u prošlosti",
            "status": 400
        }), 400
    try:
        new_date_from = datetime.strptime(request.json['date_from'], '%Y-%m-%d %H:%M')
    except Exception as e:
        return jsonify({
            "error": "Wrong date format",
            "status": 400
        }), 400

    if 'date_to' in request.json:
        try:
            new_date_to = datetime.strptime(request.json['date_to'], '%Y-%m-%d %H:%M')
        except Exception as e:
            return jsonify({
                "error": "Wrong date format",
                "status": 400
            }), 400
    else:
        new_date_to = new_date_from + timedelta(minutes=60)
        request.json['date_to'] = new_date_to.strftime('%Y-%m-%d %H:%M')

    # check if appointment overlaps with any other appointment
    overlapping = appointment_overlapping(patient_id, new_date_from, new_date_to)

    if overlapping:
        return jsonify({
            "error": "Termin se preklapa s drugim terminom",
            "status": 400
        }), 400
    
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
        order_by = request.args.get('order_by', default="therapy_id", type=str)
        order = request.args.get('order', default="asc", type=str)
        search = request.args.get('search', default="", type=str)

        if page_size > 20 or page_size < 1:
            return jsonify({
                "error": "Broj elemenata po stranici mora biti između 1 i 20",
                "status": 400
            }), 400

        valid_columns = Appointment.get_column_names()

        order_by = order_by if order_by in valid_columns else Appointment.get_pk_column_name()

        if order.lower() not in ['asc', 'desc']:
            order = 'asc'

        order_column = getattr(Appointment, order_by)
        if order.lower() == 'desc':
            order_column = order_column.desc()

        if search == "":
            appointments = (Appointment
                .query
                .filter_by(therapy_id=therapy_id)
                .order_by(order_column)
                .paginate(page=page, per_page=page_size, error_out=False)
            )
        else:
            appointments = (Appointment
                .query
                .filter_by(therapy_id=therapy_id)
                .filter(Appointment.get_search_filter(search=search))
                .order_by(order_column)
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
            "total": appointments.total
        }), 200

        if page > appointments.pages or page < 1:
            return jsonify({
                'error': 'Zatražena stranica ne postoji',
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
            "total": appointments.total
        }), 200
    
    except psycopg2.OperationalError as e:
      return jsonify({
         "error": "There was a problem with connection on server side",
         "status": 500
      }), 500
    except Exception as e:
        return jsonify({
            "error": "Stranica i broj elemenata po stranici moraju biti cijeli brojevi",
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
        order_by = request.args.get('order_by', default="therapy_id", type=str)
        order = request.args.get('order', default="asc", type=str)
        search = request.args.get('search', default="", type=str)

        if page_size > 20 or page_size < 1:
            return jsonify({
                "error": "Broj elemenata po stranici mora biti između 1 i 20",
                "status": 400
            }), 400

        valid_columns = Appointment.get_column_names()

        order_by = order_by if order_by in valid_columns else Appointment.get_pk_column_name()

        if order.lower() not in ['asc', 'desc']:
            order = 'asc'

        order_column = getattr(Appointment, order_by)
        if order.lower() == 'desc':
            order_column = order_column.desc()

        if search == "":
            appointments = (Appointment
                .query
                .join(Therapy)
                .join(Patient)
                .filter(Patient.user_id == user_id)
                .options(joinedload(Appointment.therapy).joinedload(Therapy.patient))
                .order_by(order_column)
                .paginate(page=page, per_page=page_size, error_out=False)
            )
        else:
            appointments = (Appointment
                .query
                .join(Therapy)
                .join(Patient)
                .filter(Patient.user_id == user_id)
                .options(joinedload(Appointment.therapy).joinedload(Therapy.patient))
                .filter(Appointment.get_search_filter(search=search))
                .order_by(order_column)
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
            "total": appointments.total
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
            "total": appointments.total
        }), 200
    except psycopg2.OperationalError as e:
      return jsonify({
         "error": "There was a problem with connection on server side",
         "status": 500
      }), 500
    except Exception as e:
        return jsonify({
            "error": "Stranica i broj elemenata po stranici moraju biti cijeli brojevi",
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
        order_by = request.args.get('order_by', default="therapy_id", type=str)
        order = request.args.get('order', default="asc", type=str)
        search = request.args.get('search', default="", type=str)

        if page_size > 20 or page_size < 1:
            return jsonify({
                "error": "Broj elemenata po stranici mora biti između 1 i 20",
                "status": 400
            }), 400

        valid_columns = Appointment.get_column_names()

        order_by = order_by if order_by in valid_columns else Appointment.get_pk_column_name()

        if order.lower() not in ['asc', 'desc']:
            order = 'asc'

        order_column = getattr(Appointment, order_by)
        if order.lower() == 'desc':
            order_column = order_column.desc()

        if search == "":
            appointments = (Appointment
                .query
                .filter_by(employee_id=user_id)
                .order_by(order_column)
                .paginate(page=page, per_page=page_size, error_out=False)
            )
        else:
            appointments = (Appointment
                .query
                .filter_by(employee_id=user_id)
                .filter(Appointment.get_search_filter(search=search))
                .order_by(order_column)
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
            "total": appointments.total
        }), 200

        if page > appointments.pages or page < 1:
            return jsonify({
                'error': 'Tražena stranica ne postoji',
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
            "total": appointments.total
        }), 200
    except psycopg2.OperationalError as e:
      return jsonify({
         "error": "There was a problem with connection on server side",
         "status": 500
      }), 500
    except Exception as e:
        return jsonify({
            "error": "Stranica i broj elemenata po stranici moraju biti cijeli brojevi",
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