from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask import jsonify, abort
from db import db

class Appointment(db.Model):
   appointment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
   date_from = db.Column(db.DateTime, nullable=False)
   date_to = db.Column(db.DateTime)
   comment = db.Column(db.String(300))
   status_id = db.Column(db.Integer)
   room_num = db.Column(db.Integer)
   doctor_id = db.Column(db.Integer)

   def __init__(self, **kwargs):
      # !!!! check for status_id, room_num, doctor_id if it exists !!!!
      self.comment = kwargs.get('comment', None)
      self.status_id = kwargs.get('status_id', None)
      self.room_num = kwargs.get('room_num', None)
      self.doctor_id = kwargs.get('doctor_id', None)
      try:
         self.date_from = datetime.strptime(kwargs.get('date_from', None), '%Y-%m-%d %H:%M')
         if 'date_to' in kwargs:
            self.date_to = datetime.strptime(kwargs.get('date_to', None), '%Y-%m-%d %H:%M')
      except ValueError:
         response = jsonify({'error': 'Invalid date format'})
         response.status_code = 400
         return abort(response)

   def __repr__(self):
        return f'<ID {self.appointment_id}>'
   
   def to_dict(self):
       return {
           'id': self.appointment_id,
           'room': self.room_num,
           'date_from': self.date_from,
           'date_to': self.date_to,
           'comment': self.comment,
           'status_id': self.status_id,
           'doctor_id': self.doctor_id
       }
   
   def update_appointment(self, **kwargs):
      if 'date_to' in kwargs:
         try:
            self.date_to = datetime.strptime(kwargs.get('date_to'), '%Y-%m-%d %H:%M')
         except ValueError:
            response = jsonify({'error': 'Invalid date format'})
            response.status_code = 400
            return abort(response)
      if 'comment' in kwargs:
         self.comment = kwargs.get('comment')
      if 'status_id' in kwargs: # and status_id postoji
         self.status_id = kwargs.get('status_id')
      if 'room_num' in kwargs: # and room_num postoji
         self.room_num = kwargs.get('room_num')
      if 'doctor_id' in kwargs: # and doctor_id postoji
         self.doctor_id = kwargs.get('doctor_id')