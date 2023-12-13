from db import db
from models import *

room_for_table = db.Table('roomFor',
   db.Column('room_num', db.String(10), db.ForeignKey('room.room_num')),
   db.Column('therapy_type_id', db.Integer, db.ForeignKey('therapy_type.therapy_type_id')),
   db.PrimaryKeyConstraint('room_num', 'therapy_type_id')
)

class Room(db.Model):
   room_num = db.Column(db.String(10), primary_key=True, nullable=False)
   capacity = db.Column(db.Integer, nullable=False)
   in_use = db.Column(db.Boolean, default=True, nullable=False)
   """
   therapy_types = db.relationship(
      'TherapyType',
      secondary=room_for_table,
      back_populates='rooms',
      cascade='all, delete-orphan'
   )
   """
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
"""
class RoomFor(db.Model):
   room_num = db.Column(db.String(10), nullable=False)
   therapy_type_id = db.Column(db.Integer, nullable=False)

   def __init__(self, room_num, therapy_type_id):
      self.room_num = room_num
      self.therapy_type_id = therapy_type_id
   
   def __repr__(self):
      therapy_type = TherapyType.query.get(self.therapy_type_id)
      return f'<Room: {self.room_num} for {therapy_type.therapy_type_name}>'
   
   def to_dict(self):
      therapy_type = TherapyType.query.get(self.therapy_type_id)
      return {
         'room_num': self.room_num,
         'therapy_type': therapy_type.to_dict()
      }
   
   def update(self, **kwargs):
      if 'room_num' in kwargs:
         self.room_num = kwargs.get('room_num', None)
      if 'therapy_type_id' in kwargs:
         self.therapy_type_id = kwargs.get('therapy_type_id', None)
   
   @staticmethod
   def get_name_singular():
      return "room_for"
   
   @staticmethod
   def get_name_plural():
      return "rooms_for"
"""