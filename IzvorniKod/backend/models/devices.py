from db import db
from models import *

class Device(db.Model):
   device_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
   room_num = db.Column(db.String(10), db.ForeignKey('room.room_num'))
   device_type_id = db.Column(
      db.Integer,
      db.ForeignKey(
         'device_type.device_type_id',
         ondelete="SET NULL"
      ),
      nullable=True # If device_type is deleted we don't want to delete device also so we only set foregin key to null
   )

   def __init__(self, device_type_id, **kwargs):
      self.device_type_id = device_type_id
      if 'room_num' in kwargs:
         self.room_num = kwargs.get('room_num', None)

   def __repr__(self):
      return f'<Device ID {self.device_id}>'
   
   def to_dict(self):
      dict = {
         'device_id': self.device_id,
         'room': None,
         'device_type': None
      }
      room = Room.query.get(self.room_num)
      if room:
         dict['room'] = room.to_dict()
      device_type = DeviceType.query.get(self.device_type_id)
      if device_type:
         dict['device_type'] = device_type.to_dict()
      return dict
   
   def update(self, **kwargs):
      if 'device_type_id' in kwargs:
         self.device_type_id = kwargs.get('device_type_id', None)
      if 'room_num' in kwargs:
         self.room_num = kwargs.get('room_num', None)
   
   @staticmethod
   def get_name_singular():
      return "device"
   
   @staticmethod
   def get_name_plural():
      return "devices"

class DeviceType(db.Model):
   device_type_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
   device_type_name = db.Column(db.String(50), nullable=False)
   device_type_descr = db.Column(db.String(300))

   devices = db.relationship(
      'Device',
      backref=db.backref(
         'device_type',
         passive_deletes=True
      )
   )

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

   @staticmethod
   def get_name_singular():
      return "device_type"
   
   @staticmethod
   def get_name_plural():
      return "device_types"