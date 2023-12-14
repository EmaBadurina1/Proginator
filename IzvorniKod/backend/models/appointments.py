from datetime import datetime
from db import db
from models.accounts import Employee
from models.rooms import Room
from models.therapies import Therapy

class Appointment(db.Model):
   appointment_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
   date_from = db.Column(db.DateTime, nullable=False)
   date_to = db.Column(db.DateTime)
   comment = db.Column(db.String(300))
   therapy_id = db.Column(
      db.Integer,
      db.ForeignKey(
         'therapy.therapy_id',
         ondelete="CASCADE"
      ),
      nullable=False
   )
   # statud_id is default upon initializing 
   status_id = db.Column(
      db.Integer,
      db.ForeignKey(
         'status.status_id',
         ondelete="SET NULL"
      ),
      nullable=True, # if status is deleted we do not want to delete appointment also
      default=1
   )
   room_num = db.Column(
      db.String(10),
      db.ForeignKey(
         'room.room_num',
         ondelete="SET NULL"
      )
   )
   employee_id = db.Column(
      db.Integer,
      db.ForeignKey(
         'employee.user_id',
         ondelete="SET NULL"
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
      dict = {
         'appointment_id': self.appointment_id,
         'room': None,
         'date_from': self.date_from,
         'date_to': self.date_to,
         'therapy': None,
         'comment': self.comment,
         'status': None,
         'employee': None
      }
      room = Room.query.get(self.room_num)
      if room:
         dict['room'] = room.to_dict()
      therapy = Therapy.query.get(self.therapy_id)
      if therapy:
         dict['therapy'] = therapy.to_dict()
      status = Status.query.get(self.status_id)
      if status:
         dict['status'] = status.to_dict()
      employee = Employee.query.get(self.employee_id)
      if employee:
         dict['employee'] = employee.to_dict()
      return dict
   
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

class Status(db.Model):
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