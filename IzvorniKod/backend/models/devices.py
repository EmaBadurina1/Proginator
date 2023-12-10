from db import db
from flask import jsonify

class Device(db.Model):
   device_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
   room_num = db.Column(db.String(10), db.ForeignKey('room.room_num'))
   device_type_id = db.Column(db.Integer, db.ForeignKey('device_type.device_type_id'), nullable=False)

   def __init__(self, device_type_id, **kwargs):
      self.device_type_id = device_type_id
      if 'room_num' in kwargs:
         self.room_num = kwargs.get('room_num', None)

   def __repr__(self):
      return f'<Device ID {self.device_id}>'
   
   def to_dict(self):
      return {
         'device_id': self.device_id,
         'room_num': self.room_num,
         'device_type_id': self.device_type_id
      }
   
   def update(self, **kwargs):
      if 'device_type_id' in kwargs:
         self.device_type_id = kwargs.get('device_type_id', None)
      if 'room_num' in kwargs:
         self.room_num = kwargs.get('room_num', None)

class DeviceType(db.Model):
   device_type_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
   device_type_name = db.Column(db.String(50), nullable=False)
   device_type_descr = db.Column(db.String(300))

   def __init__(self, device_type_name, **kwargs):
      self.device_type_name = device_type_name
      if 'device_type_descr' in kwargs:
         self.device_type_descr = kwargs.get('device_type_descr', None)

   def __repr__(self):
      return f'<Device type name {self.device_type_name}>'
   
   def to_dict(self):
      return {
         'device_type_id': self.device_type_id,
         'device_type_name': self.device_type_name,
         'device_type_descr': self.device_type_descr
      }
   
   def update(self, **kwargs):
      if 'device_type_name' in kwargs:
         self.device_type_name = kwargs.get('device_type_name', None)
      if 'device_type_descr' in kwargs:
         self.device_type_descr = kwargs.get('device_type_descr', None)