from controllers.crud_template import *
from models import *
from auth import auth_validation, require_any_role

# setup blueprint
from flask import Blueprint
rooms_bp = Blueprint('rooms_bp', __name__)

# get list of rooms
@rooms_bp.route('/rooms', methods=['GET'])
@auth_validation
@require_any_role('admin')
def get_rooms():
    return get_all(Model=Room, request=request)

# get room with id=room_num
@rooms_bp.route('/rooms/<string:room_num>', methods=['GET'])
@auth_validation
@require_any_role('admin', 'doctor', 'patient')
def get_room(room_num):
    room = Room.query.get(room_num);
    if room:
        return jsonify({
            "data": {
                "room": room.to_dict()
            },
            "status": 200
        }), 200
    else:
        return jsonify({
            "error": f"No room: {room_num}",
            "status": 404
        }), 404

# create new room
@rooms_bp.route('/rooms', methods=['POST'])
@auth_validation
@require_any_role('admin')
def create_room():
    required_fields = ['room_num', 'capacity', 'in_use']
    return create(required_fields=required_fields, Model=Room)

# update room with id=room_num
@rooms_bp.route('/rooms/<string:room_num>', methods=['PATCH'])
@auth_validation
@require_any_role('admin')
def update_room(room_num):
    room = Room.query.get(room_num)
    if room:
        try:
            room.update(**request.json)
            db.session.commit()
        except (ValueError, IntegrityError, DataError) as e:
            db.session.rollback()
            return jsonify({
                "error": f"Neispravan unos podataka: {e}",
                "status": 400
            }), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({
                "error": "Došlo je do pogreške prilikom spremanja podataka",
                "status": 400
            }), 400
        return jsonify({
            "data": {
                "room": room.to_dict()
            },
            "status": 200
        }), 200
    else:
        return jsonify({
            "error": f"No room: {room_num}",
            "status": 404
        }), 404
    
# delete room with id=room_num
@rooms_bp.route('/rooms/<string:room_num>', methods=['DELETE'])
@auth_validation
@require_any_role('admin')
def delete_room(room_num):
    room = Room.query.get(room_num)

    if room:
        db.session.delete(room)
        db.session.commit()
        return jsonify({
            "message": "Soba uspješno obrisana",
            "status": 200
        }), 200
    else:
        return jsonify({
            "error": f"Soba ne postoji",
            "status": 404
        }), 404