import pytest
from datetime import datetime, timedelta
from flask import Flask, session, request
from flask_sqlalchemy import SQLAlchemy
import sys, os
from posixpath import abspath, dirname
sys.path.append(abspath(dirname(__file__)))
sys.path.append('../controllers')
sys.path.append('../models')
from werkzeug.exceptions import BadRequest, NotFound, Forbidden
from controllers.appointments_controllers import create_appointment
from models import Therapy, Appointment, TherapyType, Room
from db import db
from app import build_app
from mail import mail
from time import sleep

@pytest.fixture
def client():
    app = build_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(os.getcwd(), 'temp.db')
    db.init_app(app)
    mail.init_app(app)
    with app.app_context():
        db.create_all()
        # sleep(50)
        yield app.test_client()
        db.drop_all()

def test_create_appointment_missing_fields(client):
    with client.session_transaction() as session:
        session['role'] = 'patient'
        session['user_id'] = 1
    response = client.post('/appointments', json={})
    print(response.json)
    assert response.status_code == 400
    assert response.json['message'] == "Nedostajuća polja: date_from, therapy_id"

def test_create_appointment_therapy_not_found(client):
    with client.session_transaction() as session:
        session['role'] = 'patient'
        session['user_id'] = 1
    response = client.post('/appointments', json={"date_from": "2022-01-01 10:00", "therapy_id": 1})
    assert response.status_code == 404
    assert response.json['message'] == "Terapija ne postoji"

def test_create_appointment_forbidden(client):
    with client.session_transaction() as session:
        session['role'] = 'doctor'
        session['user_id'] = 1

    response = client.post('/appointments', json={"date_from": "2022-01-01 10:00", "therapy_id": 1})
    assert response.status_code == 401
    assert response.json['message'] == "You don't have any of the required roles: patient, admin"

def test_create_appointment_invalid_date_format(client):
    with client.session_transaction() as session:
        session['role'] = 'patient'
        session['user_id'] = 1

    # create therapy
    therapy = Therapy(patient_id=1, doctor_id=1, date_from="2024-02-02", date_to="2024-03-02",
                        disease_descr="desc")
    db.session.add(therapy)
    db.session.commit()

    response = client.post('/appointments', json={"date_from": "2022-01-01", "therapy_id": 1})
    assert response.status_code == 400
    assert response.json['message'] == "Pogrešan format datuma"

def test_create_appointment_valid(client):
    with client.session_transaction() as session:
        session['role'] = 'patient'
        session['user_id'] = 1

    # create therapy_type
    therapy_type = TherapyType(therapy_type_name="test", description="desc")
    db.session.add(therapy_type)
    db.session.commit()

    # create therapy
    therapy = Therapy(patient_id=1, doctor_id=1, date_from="2024-02-02", date_to="2024-03-02",
                        disease_descr="desc", therapy_type_id=1)
    db.session.add(therapy)
    db.session.commit()

    # create room
    room = Room(room_num=1, capacity=1, in_use=True) 
    room.therapy_types.append(therapy_type)
    db.session.add(room)
    db.session.commit()

    response = client.post('/appointments', json={"date_from": "2024-02-02 10:00", "therapy_id": 1})
    assert response.status_code == 201

def test_create_appointment_no_room(client):
    with client.session_transaction() as session:
        session['role'] = 'patient'
        session['user_id'] = 1

    # create therapy_type
    therapy_type = TherapyType(therapy_type_name="test", description="desc")
    db.session.add(therapy_type)
    db.session.commit()

    # create therapy
    therapy = Therapy(patient_id=1, doctor_id=1, date_from="2024-02-02", date_to="2024-03-02",
                        disease_descr="desc", therapy_type_id=1)
    db.session.add(therapy)
    db.session.commit()

    # create room
    room = Room(room_num=1, capacity=0, in_use=True) 
    room.therapy_types.append(therapy_type)
    db.session.add(room)
    db.session.commit()

    response = client.post('/appointments', json={"date_from": "2024-02-02 10:00", "therapy_id": 1})
    assert response.status_code == 400
    assert response.json['message'] == "Nema slobodnih soba za ovaj termin"

def test_get_available_hours_by_day_therapy_not_found(client):
    with client.session_transaction() as session:
        session['role'] = 'patient'
        session['user_id'] = 1

    response = client.get('/free-appointments/therapy/1/date/2022-01-01')
    assert response.status_code == 404
    assert response.json['error'] == "Terapija ne postoji"

def test_get_available_hours_by_day(client):
    with client.session_transaction() as session:
        session['role'] = 'patient'
        session['user_id'] = 1

    # create therapy
    therapy = Therapy(patient_id=1, doctor_id=1, date_from="2024-01-01", date_to="2024-01-02",
                        disease_descr="desc", therapy_type_id=1)
    db.session.add(therapy)
    db.session.commit()

    # create therapy_type
    therapy_type = TherapyType(therapy_type_name="test", description="desc")
    db.session.add(therapy_type)

    # create room
    room = Room(room_num=1, capacity=1, in_use=True) 
    room.therapy_types.append(therapy_type)
    db.session.add(room)
    db.session.commit()

    # create appointment
    appointment = Appointment(therapy_id=1, room_num=1, date_from="2024-02-01 10:00")
    db.session.add(appointment)
    db.session.commit()

    response = client.get('/free-appointments/therapy/1/date/2024-02-01')
    assert response.status_code == 200
    assert response.json['data']['appointments'] == ['8:00', '9:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']


def main():
    pytest.main(['-x', __file__])

if __name__ == '__main__':
    main()