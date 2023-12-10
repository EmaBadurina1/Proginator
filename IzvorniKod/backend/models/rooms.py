from db import db
from flask import jsonify

class Room(db.Model):
   room_num = db.Column(db.String(10), primary_key=True, nullable=False)
   capacity = db.Column(db.Integer, nullable=False)
   in_use = db.Column(db.Boolean, default=True, nullable=False)

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