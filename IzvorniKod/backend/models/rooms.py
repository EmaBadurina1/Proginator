from db import db
from models import *
from sqlalchemy import or_

# many to many table
room_for_table = db.Table('room_for',
   db.Column(
      'room_num',
      db.String(10),
      db.ForeignKey(
         'room.room_num',
         ondelete="CASCADE",
         onupdate="CASCADE"
      ),
      nullable=False
   ),
   db.Column(
      'therapy_type_id',
      db.Integer,
      db.ForeignKey(
         'therapy_type.therapy_type_id',
         ondelete="CASCADE",
         onupdate="CASCADE"
      ),
      nullable=False
   ),
   db.PrimaryKeyConstraint('room_num', 'therapy_type_id')
)

class Room(db.Model):
   __tablename__ = 'room'
   room_num = db.Column(db.String(10), primary_key=True, nullable=False)
   capacity = db.Column(db.Integer, nullable=False)
   in_use = db.Column(db.Boolean, default=True, nullable=False)

   therapy_types = db.relationship(
      'TherapyType',
      secondary=room_for_table,
      backref=db.backref(
         'rooms',
         passive_deletes=True
      )
   )
   
   appointments = db.relationship(
      'Appointment',
      backref=db.backref(
         'room',
         passive_deletes=True
      )      
   )

   devices = db.relationship(
      'Device',
      backref=db.backref(
         'room',
         passive_deletes=True
      ) 
   )

   def __init__(self, room_num, capacity, in_use):
      self.room_num = room_num
      self.capacity = capacity
      self.in_use = in_use
   
   def __repr__(self):
      return f'<Room {self.room_num}>'
   
   def to_dict(self):
      return {
         'room_num': self.room_num,
         'capacity': self.capacity,
         'in_use': self.in_use,
         'therapy_types': [therapy_type.to_dict() for therapy_type in self.therapy_types],
         'devices': [device.to_dict_simple() for device in self.devices]
      }

   def to_dict_simple(self):
      return {
         'room_num': self.room_num,
         'capacity': self.capacity,
         'in_use': self.in_use
      }

   def update(self, **kwargs):
      if 'room_num' in kwargs:
         self.room_num = kwargs.get('room_num', None)
      if 'capacity' in kwargs:
         self.capacity = kwargs.get('capacity', None)
      if 'in_use' in kwargs:
         self.in_use = kwargs.get('in_use', None)
   
   @staticmethod
   def get_name_singular():
      return "room"
   
   @staticmethod
   def get_name_plural():
      return "rooms"
   
   @staticmethod
   def get_search_filter(search):
      return or_(
         Room.room_num.like(f"%{search}%")
      )
   
   @staticmethod
   def get_column_names():
      return [
         'room_num',
         'capacity',
         'in_use'
      ]

   @staticmethod
   def get_pk_column_name():
      return 'room_num'