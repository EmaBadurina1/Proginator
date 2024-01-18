from sqlalchemy import and_, not_, or_
from controllers.crud_template import *
from models import *
from auth import auth_validation, require_any_role
from sqlalchemy.orm import joinedload
from sqlalchemy import text
import psycopg2
from flask import request, jsonify, session
from db import db
from datetime import datetime, timedelta
from mail import mail
from flask_mail import Message

from utils.appointments_util import appointment_overlapping

# setup blueprint
from flask import Blueprint
appointments_bp = Blueprint('appointments_bp', __name__)

# get list of appointments
@appointments_bp.route('/appointments', methods=['GET'])
@auth_validation
@require_any_role('admin', 'doctor')
def get_appointments():
    return get_all(Model=Appointment, request=request)

# get appointment with id=appointment_id
@appointments_bp.route('/appointments/<int:appointment_id>', methods=['GET'])
@auth_validation
@require_any_role('admin', 'doctor', 'patient')
def get_appointment(appointment_id):
    return get_one(id=appointment_id, Model=Appointment)

# get list of free appointments for therapy with id=therapy_id
@appointments_bp.route('/free-appointments/therapy/<int:therapy_id>/date/<string:day>', methods=['GET'])
@auth_validation
@require_any_role('admin', 'doctor', 'patient')
def get_free_appointments_by_day(therapy_id, day):
    # check if therapy exists
    therapy = Therapy.query.filter_by(therapy_id=therapy_id).first()
    if not therapy:
        return jsonify({
            "error": "Terapija ne postoji",
            "status": 404
        }), 404

    # patient can only create his appointments
    if session['role'] == 'patient' and therapy.patient_id != session['user_id']:
        return jsonify({
            "error": "Forbidden",
            "status": 403
        }), 403
    
    # generate a list of hours in a day
    hours = [f'{hour}:00' for hour in range(8, 20)]

    # remove hours that overlap with other appointments, use date_from looks like day
    date_from = datetime.strptime(day, '%Y-%m-%d')
    date_from_next_day = date_from + timedelta(days=1)
    therapy_ids = Therapy.query.filter(Therapy.patient_id==therapy.patient_id).with_entities(Therapy.therapy_id).all()
    
    therapy_ids = [x[0] for x in therapy_ids]
    appointments = Appointment.query.filter(and_(
        Appointment.therapy_id.in_(therapy_ids), 
        Appointment.date_from.between(date_from, date_from_next_day)
        )).all()
    appointments = [appointment.date_from.strftime('%H:%M') for appointment in appointments]

    for appointment in appointments:
        for hour in hours:
            if appointment.split(":")[0] == hour.split(":")[0]:
                hours.remove(hour)

                # if appointment does not start at the beginning of the hour, remove the next hour too, 
                # because every appointment lasts 60 minutes
                if appointment.split(":")[1] != "00":
                    hours.remove(f'{int(hour.split(":")[0])+1}:00')

    # find rooms for specified therapy type
    rooms = TherapyType.query.filter_by(therapy_type_id=therapy.therapy_type_id).first().rooms

    # remove hours for which there are no rooms available
    for hour in hours:
        new_date_from = datetime.strptime(f'{day} {hour}', '%Y-%m-%d %H:%M')
        new_date_to = new_date_from + timedelta(minutes=60)

        check = False # check if there is a room with enough capacity
        for room in rooms:
            appointments = Appointment.query.filter(and_(
                Appointment.room_num==room.room_num, 
                Appointment.date_from>=new_date_from,
                Appointment.date_from<new_date_to
                )).all()
            
            if len(appointments) < room.capacity:
                check = True # there is a room with enough capacity
                break

        if not check:
            hours.remove(hour)

    return jsonify({
        "data": {
            "appointments": hours
        },
        "status": 200
    }), 200

# create new appointment
@appointments_bp.route('/appointments', methods=['POST'])
@auth_validation
@require_any_role('patient', 'admin')
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
    therapy = Therapy.query.filter_by(therapy_id=request.json['therapy_id']).first()

    if not therapy:
        return jsonify({
            "error": "Terapija ne postoji",
            "status": 404
        }), 404
    
    patient_id = therapy.patient_id

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

    # check for room capacity
    # find rooms for specified therapy type
    rooms = TherapyType.query.filter_by(therapy_type_id=therapy.therapy_type_id).first().rooms
    for room in rooms:
        appointments = Appointment.query.filter(and_(
            Appointment.room_num==room.room_num, 
            Appointment.date_from>=new_date_from,
            Appointment.date_from<new_date_to
            )).all()
        # if there is a room with enough capacity, assign it to the appointment
        if len(appointments) < room.capacity:
            request.json['room_num'] = room.room_num
            break
    
    if 'room_num' not in request.json:
        return jsonify({
            "error": "Nema slobodnih soba za ovaj termin",
            "status": 400
        }), 400
    
    missing_fields = validate_required_fields(request.json, required_fields)

    if missing_fields:
        error_message = f"Missing fields: {', '.join(missing_fields)}"
        return jsonify({
            "error": error_message,
            "status": 400
        }), 400
    
    appointment = Appointment(**request.json)

    try:
        db.session.add(appointment)
        db.session.commit()
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

    if appointment:
        if appointment.therapy:
            if appointment.therapy.patient:
                if appointment.therapy.patient.email:
                    email = appointment.therapy.patient.email

    if email:
        msg = Message(
            'Rezerviran termin - RehApp',
            sender='proginator@fastmail.com',
            recipients=[email]
        )
        msg.body = "Vaš termin je dana: " + appointment.date_from.strftime("%Y-%m-%d %H:%M") + "\nSoba: " + appointment.room_num
        mail.send(msg)

    return jsonify({
        "data": {
            "appointment": appointment.to_dict()
        },
        "status": 201
    }), 201

# update appointment with id=appointment_id
@appointments_bp.route('/appointments/<int:appointment_id>', methods=['PATCH'])
@auth_validation
@require_any_role('admin', 'patient', 'doctor')
def update_appointment(appointment_id):
    required_fields = ['date_from']
    missing_fields = validate_required_fields(request.json, required_fields)

    if missing_fields:
        error_message = f"Nedostajuća polja: {', '.join(missing_fields)}"
        return jsonify({
            "error": error_message,
            "status": 400
        }), 400

    appointment = Appointment.query.filter_by(appointment_id=appointment_id).first()

    if not appointment:
        return jsonify({
            "error": "Termin ne postoji",
            "status": 404
        }), 404
    
    # get patient and duration from therapy with database session
    therapy = Therapy.query.filter_by(therapy_id=appointment.therapy_id).first()

    if not therapy:
        return jsonify({
            "error": "Terapija termina ne postoji",
            "status": 404
        }), 404
    
    patient_id = therapy.patient_id

    # patient can only create his appointments
    if session['role'] == 'patient' and patient_id != session['user_id']:
        return jsonify({
            "error": "Forbidden",
            "status": 403
        }), 403
    
    # check if new date is in the past
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

    # check for room capacity
    # find rooms for specified therapy type
    rooms = TherapyType.query.filter_by(therapy_type_id=therapy.therapy_type_id).first().rooms
    for room in rooms:
        appointments = Appointment.query.filter(and_(
            Appointment.room_num==room.room_num, 
            Appointment.date_from>=new_date_from,
            Appointment.date_from<new_date_to
            )).all()
        # if there is a room with enough capacity, assign it to the appointment
        if len(appointments) < room.capacity:
            request.json['room_num'] = room.room_num
            break
    
    if 'room_num' not in request.json:
        return jsonify({
            "error": "Nema slobodnih soba za ovaj termin",
            "status": 400
        }), 400

    appointment = Appointment.query.get(appointment_id)
    if appointment:
        try:
            appointment.update(**request.json)
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
        
        if request.json.get("date_from") and request.json.get("room_num"):
            if appointment:
                if appointment.therapy:
                    if appointment.therapy.patient:
                        if appointment.therapy.patient.email:
                            email = appointment.therapy.patient.email

            if email:
                msg = Message(
                    'Rezerviran termin - RehApp',
                    sender='proginator@fastmail.com',
                    recipients=[email]
                )
                msg.body = "Vaš termin je dana: " + appointment.date_from.strftime("%Y-%m-%d %H:%M") + "\nSoba: " + appointment.room_num
                mail.send(msg)

        return jsonify({
            "data": {
                "appointment": appointment.to_dict()
            },
            "status": 200
        }), 200
    else:
        return jsonify({
            "error": f"Nepostojeći ID: {appointment_id}",
            "status": 404
        }), 404
    
# delete appointment with id=appointment_id
@appointments_bp.route('/appointments/<int:appointment_id>', methods=['DELETE'])
@auth_validation
@require_any_role('admin', 'patient')
def delete_appointment(appointment_id):
    # # patient can only delete his appointments
    # appointment = Appointment.query.filter_by(appointment_id=appointment_id).first()
    # if session['role'] == 'patient' and appointment.therapy.patient_id != session['user_id']:
    #     return jsonify({
    #         "error": "Forbidden",
    #         "status": 403
    #     }), 403
    return delete(id=appointment_id, Model=Appointment)

# OVO JE PROMJENA
# update attendance of appointment
@appointments_bp.route('/attendance/<int:appointment_id>', methods=['PATCH'])
@auth_validation
@require_any_role('admin', 'doctor')
def attendance_appointment(appointment_id):
        required_fields = ['status_id','comment']
        missing_fields = validate_required_fields(request.json, required_fields)

        # na frontu se vec radi validacija ali kao...
        if missing_fields:
                error_message = f"Nedostajuća polja: {', '.join(missing_fields)}"
                return jsonify({
                "error": error_message,
                "status": 400
                }), 400
        
        appointment = Appointment.query.filter_by(appointment_id=appointment_id).first()
        
        return update(id=appointment_id, Model=Appointment)

# get list of appointments by therapy_id
@appointments_bp.route('/appointments/by-therapy/<int:therapy_id>', methods=['GET'])
@auth_validation
@require_any_role('admin', 'patient')
def get_by_therapy(therapy_id):
    # # patient can only see his appointments
    # therapy = Therapy.query.filter_by(therapy_id=therapy_id).first()
    # if not therapy:
    #     return jsonify({
    #         "error": "Terapija ne postoji",
    #         "status": 404
    #     }), 404
    
    # if session['role'] == 'patient' and therapy.patient_id != session['user_id']:
    #     return jsonify({
    #         "error": "Forbidden",
    #         "status": 403
    #     }), 403

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

@appointments_bp.route('/appointments/active', methods=['GET'])
@auth_validation
@require_any_role('doctor', 'admin')
def get_all_active_appointments():
    try:
        page = request.args.get('page', default = 1, type = int)
        page_size = request.args.get('page_size', default = 20, type = int)
        order_by = request.args.get('order_by', default="date_from", type=str)
        order = request.args.get('order', default="asc", type=str)
        search = request.args.get('search', default="", type=str)

        if page_size > 20 or page_size < 1:
            return jsonify({
                "error": "Stranica mora sadržavati između 1 i 20 elemenata",
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
                .filter((Appointment.status_id == 1) | (Appointment.status_id == 2))
                .order_by(order_column)
                .paginate(page=page, per_page=page_size, error_out=False)
            )
        else:
            appointments = (Appointment
                .query
                .filter((Appointment.status_id == 1) | (Appointment.status_id == 2))
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
                "appointments": [item.to_dict() for item in appointments.items]
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

@appointments_bp.route('/occupied-appointments/room/<string:room_num>', methods=['GET'])
@auth_validation
@require_any_role('admin', 'patient', 'doctor')
def get_occupied_hours(room_num):
    try:
        sql = text('''
            SELECT appointment.date_from FROM appointment
            LEFT JOIN room ON room.room_num = appointment.room_num
            WHERE room.room_num = :room_num
            AND room.in_use = TRUE
            AND appointment.date_from >= current_timestamp
            GROUP BY appointment.date_from, room.capacity
            HAVING COUNT(appointment.date_from) >= room.capacity;
        ''')

        result = db.session.execute(sql, {'room_num': room_num})

        # Fetch the date_times from the result and create a list
        date_times = [row[0].strftime('%Y-%m-%d %H:%M') for row in result.fetchall()]

        return jsonify({
            "data": {
                "times": date_times,
                "room_num": room_num
            },
            "status": 200
        }), 200

    except Exception as e:
        return jsonify({
            "error": "There was a problem with your request",
            "status": 400
        }), 400