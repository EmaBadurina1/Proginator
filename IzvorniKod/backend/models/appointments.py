from datetime import datetime
from db import db
from sqlalchemy import or_

class Appointment(db.Model):
   __tablename__ = 'appointment'
   appointment_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
   date_from = db.Column(db.DateTime, nullable=False)
   date_to = db.Column(db.DateTime)
   comment = db.Column(db.String(300))
   therapy_id = db.Column(
      db.Integer,
      db.ForeignKey(
         'therapy.therapy_id',
         ondelete="CASCADE",
         onupdate="CASCADE"
      ),
      nullable=False
   )
   status_id = db.Column(
      db.Integer,
      db.ForeignKey(
         'status.status_id',
         ondelete="SET NULL",
         onupdate="CASCADE"
      )
   )
   room_num = db.Column(
      db.String(10),
      db.ForeignKey(
         'room.room_num',
         ondelete="SET NULL",
         onupdate="CASCADE"
      )
   )
   employee_id = db.Column(
      db.Integer,
      db.ForeignKey(
         'employee.user_id',
         ondelete="SET NULL",
         onupdate="CASCADE"
      )
   )

   def __init__(self, date_from, therapy_id, **kwargs):
      self.therapy_id = therapy_id
      self.date_from = datetime.strptime(date_from, '%Y-%m-%d %H:%M')
      if 'comment' in kwargs:
         self.comment = kwargs.get('comment', None)
      if 'room_num' in kwargs:
         self.room_num = kwargs.get('room_num', None)
      if 'employee_id' in kwargs:
         self.employee_id = kwargs.get('employee_id', None)
      if 'date_to' in kwargs:
         self.date_to = datetime.strptime(kwargs.get('date_to', None), '%Y-%m-%d %H:%M')

   def __repr__(self):
      return f'<Appointment ID {self.appointment_id}>'
   
   def to_dict(self):
      return {
         'appointment_id': self.appointment_id,
         'room': self.room.to_dict_simple() if self.room else None,
         'date_from': self.date_from,
         'date_to': self.date_to,
         'therapy': self.therapy.to_dict_simple() if self.therapy else None,
         'comment': self.comment,
         'status': self.status.to_dict() if self.status else None,
         'employee': self.doctor.to_dict() if self.doctor else None
      }

   def to_dict_simple(self):
      return {
         'appointment_id': self.appointment_id,
         'room': self.room.to_dict_simple() if self.room else None,
         'date_from': self.date_from,
         'date_to': self.date_to,
         'comment': self.comment,
         'status': self.status.to_dict() if self.status else None,
         'employee': self.doctor.to_dict() if self.doctor else None
      }

   def update(self, **kwargs):
      if 'date_from' in kwargs:
         self.date_from = datetime.strptime(kwargs.get('date_from', None), '%Y-%m-%d %H:%M')
      if 'date_to' in kwargs:
         self.date_to = datetime.strptime(kwargs.get('date_to', None), '%Y-%m-%d %H:%M')
      if 'comment' in kwargs:
         self.comment = kwargs.get('comment', None)
      if 'status_id' in kwargs: # and status_id postoji
         self.status_id = kwargs.get('status_id', None)
      if 'room_num' in kwargs: # and room_num postoji
         self.room_num = kwargs.get('room_num', None)
      if 'employee_id' in kwargs: # and doctor_id postoji
         self.employee_id = kwargs.get('employee_id', None)
      if 'therapy_id' in kwargs: # and therapy_id postoji
         self.therapy_id = kwargs.get('therapy_id', None)
   
   @staticmethod
   def get_name_singular():
      return "appointment"
   
   @staticmethod
   def get_name_plural():
      return "appointments"
   
   @staticmethod
   def get_search_filter(search):
      return or_(
         Appointment.comment.like(f"%{search}%"),
         Appointment.room_num.like(f"%{search}%")
      )
   
   @staticmethod
   def get_column_names():
      return [
         'appointment_id',
         'date_from',
         'date_to',
         'comment',
         'therapy_id',
         'status_id',
         'room_num',
         'employee_id'
      ]

   @staticmethod
   def get_pk_column_name():
      return 'appointment_id'

class Status(db.Model):
   __tablename__ = 'status'
   status_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
   status_name = db.Column(db.String(50), nullable=False)

   appointments = db.relationship(
      'Appointment',
      backref=db.backref(
         'status',
         passive_deletes=True
      )
   )

   def __init__(self, status_name):
      self.status_name = status_name

   def __repr__(self):
      return f'<Status {self.status_name}>'
   
   def to_dict(self):
      return {
         'status_id': self.status_id,
         'status_name': self.status_name
      }
   
   def update(self, **kwargs):
      if 'status_name' in kwargs:
         self.status_name = kwargs.get('status_name', None)

   @staticmethod
   def get_name_singular():
      return "status"
   
   @staticmethod
   def get_name_plural():
      return "statuses"
   
   @staticmethod
   def get_search_filter(search):
      return or_(
         Status.status_name.like(f"%{search}%")
      )
   
   @staticmethod
   def get_column_names():
      return [
         'status_id',
         'status_name'
      ]

   @staticmethod
   def get_pk_column_name():
      return 'status_id'