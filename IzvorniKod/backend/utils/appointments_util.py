from sqlalchemy import or_, not_
from models import Appointment, Therapy, TherapyType, Room
from datetime import datetime, timedelta
from flask import abort, request
from sqlalchemy import and_
from utils.errors import *


def appointment_overlapping(patient_id, new_date_from, new_date_to):
    '''
    Returns True if new appointment overlaps with any of patient's appointments, False otherwise
    '''

    therapy_ids = Therapy.query.filter_by(patient_id=patient_id).with_entities(Therapy.therapy_id).all()
    therapy_ids = [therapy_id[0] for therapy_id in therapy_ids]

    # get all appointments that overlap with new appointment
    overlapping_appointments = (
        Appointment
        .query
        .filter(Appointment.therapy_id.in_(therapy_ids), Appointment.date_from == new_date_from)
        .all()
    )
    print(overlapping_appointments)
    if overlapping_appointments:
        return True
    else:
        return False
    

def get_room_for_therapy_type(therapy_type_id, date_from, date_to):
    '''
    Returns first available room for specified therapy type
    '''
    # check for room capacity
    # find rooms for specified therapy type
    therapy_type = TherapyType.query.filter_by(therapy_type_id=therapy_type_id).first()
    if not therapy_type:
        abort(NotFoundError("Tip terapije ne postoji"))

    rooms = therapy_type.rooms
    # remove room if id not active
    rooms = [room for room in rooms if room.in_use]

    for room in rooms:
        appointments = Appointment.query.filter(and_(
            Appointment.room_num==room.room_num, 
            Appointment.date_from==date_from
            )).all()
        # if there is a room with enough capacity, assign it to the appointment
        if len(appointments) < room.capacity:
            return room.room_num
        
    return None

def check_room_capacity(room_num, date_from):
    '''
    Returns True if room has enough capacity for new appointment, False otherwise
    '''
    # get room capacity
    room_capacity = Room.query.filter_by(room_num=room_num).first().capacity
    # get number of appointments in room
    num_appointments = len(Appointment.query.filter_by(room_num=room_num, date_from=date_from).all())
    if num_appointments < room_capacity:
        return True
    else:
        return False