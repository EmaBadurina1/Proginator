from datetime import datetime
from models import *
from db import db

class Therapy(db.Model):
   __tablename__ = 'therapy'
   therapy_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
   doctor_id = db.Column(db.Integer, nullable=False)
   disease_descr = db.Column(db.String(300), nullable=False)
   req_treatment = db.Column(db.String(300))
   date_from = db.Column(db.Date, nullable=False, default=datetime.now().date())
   date_to = db.Column(db.Date)
   patient_id = db.Column(
      db.Integer,
      db.ForeignKey(
         'patient.user_id',
         ondelete="SET NULL",
         onupdate="CASCADE"
      )
   )
   therapy_type_id = db.Column(
      db.Integer,
      db.ForeignKey(
         'therapy_type.therapy_type_id',
         ondelete="SET NULL",
         onupdate="CASCADE"
      )
   )

   appointments = db.relationship(
      'Appointment',
      backref=db.backref(
         'therapy',
         passive_deletes=True
      )
   )

   def __init__(self, doctor_id, disease_descr, patient_id, date_from, **kwargs):
      self.doctor_id = doctor_id
      self.disease_descr = disease_descr
      self.patient_id = patient_id
      self.date_from = datetime.strptime(date_from, '%Y-%m-%d')
      
      if 'req_treatment' in kwargs:
         self.req_treatment = kwargs.get('req_treatment', None)
      if 'date_to' in kwargs:
         self.date_to = datetime.strptime(kwargs.get('date_to', None), '%Y-%m-%d')
      if 'therapy_type_id' in kwargs:
         self.therapy_type_id = kwargs.get('therapy_type_id', None)

   def __repr__(self):
      return f'<Therapy ID {self.therapy_id}>'
   
   def to_dict(self):
      dict = {
         'therapy_id': self.therapy_id,
         'doctor_id': self.doctor_id, # spojiti s doktorom iz eksterne baze
         'disease_descr': self.disease_descr,
         'req_treatment': self.req_treatment,
         'date_from': self.date_from,
         'date_to': self.date_to,
         'patient': None,
         'therapy_type': None,
      }
      patient = Patient.query.get(self.patient_id)
      if patient:
         dict['patient'] = patient.to_dict()
      therapy_type = TherapyType.query.get(self.therapy_type_id)
      if therapy_type:
         dict['therapy_type'] = therapy_type.to_dict()
      return dict
   
   def update(self, **kwargs):
      if 'doctor_id' in kwargs:
         self.doctor_id = kwargs.get('doctor_id', None)
      if 'disease_descr' in kwargs:
         self.disease_descr = kwargs.get('disease_descr', None)
      if 'req_treatment' in kwargs:
         self.req_treatment = kwargs.get('req_treatment', None)
      if 'date_from' in kwargs:
         self.date_from = datetime.strptime(kwargs.get('date_from', None), '%Y-%m-%d')
      if 'date_to' in kwargs:
         self.date_to = datetime.strptime(kwargs.get('date_to', None), '%Y-%m-%d')
      if 'patient_id' in kwargs:
         self.patient_id = kwargs.get('patient_id', None)
      if 'therapy_type_id' in kwargs:
         self.therapy_type_id = kwargs.get('therapy_type_id', None)
   
   @staticmethod
   def get_name_singular():
      return "therapy"
   
   @staticmethod
   def get_name_plural():
      return "therapies"

class TherapyType(db.Model):
   __tablename__ = 'therapy_type'
   therapy_type_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
   therapy_type_name = db.Column(db.String(50), nullable=False)
   therapy_type_descr = db.Column(db.String(300))

   therapies = db.relationship(
      'Therapy',
      backref=db.backref(
         'therapy_type',
         passive_deletes=True
      )
   )

   def __init__(self, therapy_type_name, **kwargs):
      self.therapy_type_name = therapy_type_name
      if 'therapy_type_descr' in kwargs:
         self.therapy_type_descr = kwargs.get('therapy_type_descr', None)
   
   def __repr__(self):
      return f'<Therapy type {self.therapy_type_name}>'
   
   def to_dict(self):
      return {
         'therapy_type_id': self.therapy_type_id,
         'therapy_type_name': self.therapy_type_name,
         'therapy_type_descr': self.therapy_type_descr
      }
   
   def update(self, **kwargs):
      if 'therapy_type_name' in kwargs:
         self.therapy_type_name = kwargs.get('therapy_type_name', None)
      if 'therapy_type_descr' in kwargs:
         self.therapy_type_descr = kwargs.get('therapy_type_descr', None)
   
   @staticmethod
   def get_name_singular():
      return "therapy_type"
   
   @staticmethod
   def get_name_plural():
      return "therapy_types"