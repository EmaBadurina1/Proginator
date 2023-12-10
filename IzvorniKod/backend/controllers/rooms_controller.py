from controllers.crud_template import *
from models import *
from auth import auth_validation

# setup blueprint
from flask import Blueprint
rooms_bp = Blueprint('rooms_bp', __name__)

# get list of rooms
@rooms_bp.route('/rooms', methods=['GET'])
@auth_validation
def get_rooms():
    return get_all(Model=Room)

# get room with id=room_num
@rooms_bp.route('/rooms/<string:room_num>', methods=['GET'])
@auth_validation
def get_room(room_num):
    return get_one(id=room_num, Model=Room)

# create new room
@rooms_bp.route('/rooms', methods=['POST'])
@auth_validation
def create_room():
    required_fields = ['room_num', 'capacity', 'in_use']
    return create(required_fields=required_fields, Model=Room)

# update room with id=room_num
@rooms_bp.route('/rooms/<string:room_num>', methods=['PATCH'])
@auth_validation
def update_room(room_num):
    return update(id=room_num, Model=Room)
    
# delete room with id=room_num
@rooms_bp.route('/rooms/<string:room_num>', methods=['DELETE'])
@auth_validation
def delete_room(room_num):
    return delete(id=room_num, Model=Room)