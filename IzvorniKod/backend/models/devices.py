from db import db
from models import *
from sqlalchemy import or_

class Device(db.Model):
   __tablename__ = 'device'
   device_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
   room_num = db.Column(
      db.String(10),
      db.ForeignKey(
         'room.room_num',
         ondelete="SET NULL",
         onupdate="CASCADE"
      )
   )
   device_type_id = db.Column(
      db.Integer,
      db.ForeignKey(
         'device_type.device_type_id',
         ondelete="SET NULL",
         onupdate="CASCADE"
      )
   )

   def __init__(self, device_type_id, **kwargs):
      self.device_type_id = device_type_id
      if 'room_num' in kwargs:
         self.room_num = kwargs.get('room_num', None)

   def __repr__(self):
      return f'<Device ID {self.device_id}>'
   
   def to_dict(self):
      return {
         'device_id': self.device_id,
         'room': self.room.to_dict_simple() if self.room else None,
         'device_type': self.device_type.to_dict() if self.device_type else None
      }

   def to_dict_simple(self):
      return {
         'device_id': self.device_id,
         'device_type': self.device_type.to_dict() if self.device_type else None
      }

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

   @staticmethod
   def get_search_filter(search):
      return or_(
         Device.room_num.like(f"%{search}%")
      )
   
   @staticmethod
   def get_column_names():
      return [
         'device_id',
         'room_num',
         'device_type_id'
      ]

   @staticmethod
   def get_pk_column_name():
      return 'device_id'

class DeviceType(db.Model):
   __tablename__ = 'device_type'
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
   
   @staticmethod
   def get_search_filter(search):
      return or_(
         DeviceType.device_type_name.like(f"%{search}%"),
         DeviceType.device_type_descr.like(f"%{search}%"),
      )
   
   @staticmethod
   def get_column_names():
      return [
         'device_type_id',
         'device_type_name',
         'device_type_descr'
      ]

   @staticmethod
   def get_pk_column_name():
      return 'device_type_id'