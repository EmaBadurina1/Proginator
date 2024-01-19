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

from utils.appointments_util import *
from utils.errors import *

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

# get list of available hours for specified therapy type for day
@appointments_bp.route('/free-appointments/therapy/<int:therapy_id>/date/<string:day>', methods=['GET'])
@auth_validation
@require_any_role('admin', 'doctor', 'patient')
def get_available_hours_by_day(therapy_id, day):
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

    # get all appointments in the same day
    sql = text('''
        SELECT appointment.date_from FROM appointment
        LEFT JOIN therapy ON therapy.therapy_id = appointment.therapy_id
        where patient_id = :patient_id
        and DATE(appointment.date_from) = :day
    ''')

    result = db.session.execute(sql, {'day': day, 'patient_id': therapy.patient_id})

    # Fetch the date_times from the result and create a list
    appointments = [row[0].strftime('%H:%M') for row in result.fetchall()]

    for appointment in appointments:
        for hour in hours:
            if int(appointment.split(":")[0]) == int(hour.split(":")[0]):
                hours.remove(hour)

    # find rooms for specified therapy type
    rooms = TherapyType.query.filter_by(therapy_type_id=therapy.therapy_type_id).first().rooms

    # remove hours for which there are no rooms available
    for hour in hours:
        new_date_from = datetime.strptime(f'{day} {hour}', '%Y-%m-%d %H:%M')

        check = False # check if there is a room with enough capacity
        for room in rooms:
            appointments = Appointment.query.filter(and_(
                Appointment.room_num==room.room_num, 
                Appointment.date_from==new_date_from
                )).all()
            
            if len(appointments) < room.capacity:
                check = True
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
    # check if request contains required fields
    required_fields = ['date_from', 'therapy_id']
    missing_fields = validate_required_fields(request.json, required_fields)
    if missing_fields:
        error_message = f"Nedostajuća polja: {', '.join(missing_fields)}"
        return BadRequestError(message=error_message)

    # check if therapy exists
    therapy = Therapy.query.filter_by(therapy_id=request.json['therapy_id']).first()
    if not therapy:
        return NotFoundError(message="Terapija ne postoji")
    
    # patient can only create his appointments
    patient_id = therapy.patient_id
    if session['role'] == 'patient' and patient_id != session['user_id']:
        return ForbiddenError(message="Forbidden")
    
    # create new_date_from
    try:
        new_date_from = datetime.strptime(request.json['date_from'], '%Y-%m-%d %H:%M')
    except Exception as e:
        return BadRequestError(message="Pogrešan format datuma")
    
    # check if appointment is in the past
    if new_date_from < datetime.now():
        return BadRequestError(message="Termin ne može biti u prošlosti")

    # check if request contains date_to
    if 'date_to' in request.json:
        return BadRequestError(message="Zahtjev ne može imati date_to")
    new_date_to = new_date_from + timedelta(minutes=60)

    # check if appointment overlaps with any other appointment
    overlapping = appointment_overlapping(patient_id, new_date_from, new_date_to)
    if overlapping:
        return BadRequestError(message="Termin se preklapa s drugim terminom")

    if 'room_num' in request.json:
        if not check_room_capacity(request.json['room_num'], new_date_from):
            return BadRequestError(message="Soba nema dovoljno kapaciteta")
    else:
        # check for room capacity
        room_num = get_room_for_therapy_type(therapy.therapy_type_id, new_date_from, new_date_to)
        if not room_num:
            return BadRequestError(message="Nema slobodnih soba za ovaj termin")
        request.json['room_num'] = room_num

    appointment = Appointment(**request.json)

    try:
        db.session.add(appointment)
        db.session.commit()
    except (ValueError, IntegrityError, DataError) as e:
        db.session.rollback()
        return BadRequestError(message=f"Podaci su neispravni: {e}")
    except Exception as e:
        db.session.rollback()
        return ServerError(message="Došlo je do pogreške prilikom spremanja podataka")

    email = None
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
    appointment = Appointment.query.filter_by(appointment_id=appointment_id).first()

    if not appointment:
        return NotFoundError(message=f"Nepostojeći ID: {appointment_id}")
    
    # get patient and duration from therapy with database session
    therapy = Therapy.query.filter_by(therapy_id=appointment.therapy_id).first()
    if not therapy:
        return NotFoundError(message="Terapija ne postoji")
    
    # patient can only create his appointments
    patient_id = therapy.patient_id
    if session['role'] == 'patient' and patient_id != session['user_id']:
        return ForbiddenError(message="Forbidden")
    
    if 'date_from' in request.json:
        try:
            new_date_from = datetime.strptime(request.json['date_from'], '%Y-%m-%d %H:%M')
        except Exception as e:
            return BadRequestError(message="Pogrešan format datuma")
        
        new_date_to = new_date_from + timedelta(minutes=60)
        request.json['date_to'] = new_date_to.strftime('%Y-%m-%d %H:%M')
        
        # check if new date is in the past
        if new_date_from < datetime.now():
            return BadRequestError(message="Termin ne može biti u prošlosti")
        
        # check if appointment overlaps with any other appointment
        overlapping = appointment_overlapping(patient_id, new_date_from, new_date_to)
        if overlapping:
            return BadRequestError(message="Termin se preklapa s drugim terminom")

        # check for room capacity
        room_num = get_room_for_therapy_type(therapy.therapy_type_id, new_date_from, new_date_to)
        if not room_num:
            return BadRequestError(message="Nema slobodnih soba za ovaj termin")

        request.json['room_num'] = room_num
    
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

    if appointment.therapy.patient.email:
        email = appointment.therapy.patient.email
        
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
        return BadRequestError(message=error_message)
    
    appointment = Appointment.query.filter_by(appointment_id=appointment_id).first()
    if not appointment:
        return NotFoundError(message=f"Nepostojeći ID: {appointment_id}")
    
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

        print(date_times)

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