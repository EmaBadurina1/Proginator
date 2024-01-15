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
    #return create(required_fields=required_fields, Model=Room)

    missing_fields = validate_required_fields(request.json, required_fields)

    if missing_fields:
        error_message = f"Missing fields: {', '.join(missing_fields)}"
        return jsonify({
            "error": error_message,
            "status": 400
        }), 400
    
    room_num = request.json["room_num"]
    capacity = request.json["capacity"]
    in_use = request.json["in_use"]

    room = Room(room_num=room_num, capacity=capacity, in_use=in_use)

    try:
        db.session.add(room)
        db.session.commit()
    except (ValueError, IntegrityError, DataError) as e:
        db.session.rollback()
        return jsonify({
            "error": "Podaci su neispravni",
            "status": 400
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Došlo je do pogreške prilikom spremanja podataka",
            "status": 500
        }), 500

    if request.is_json and "therapy_types" in request.json and isinstance(request.json["therapy_types"], list):
        try:
            for therapy_type_id in request.json["therapy_types"]:
                therapy_type = TherapyType.query.get(therapy_type_id)
                if therapy_type:
                    db.session.add(therapy_type)
                    room.therapy_types.append(therapy_type)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({
                "error": "Došlo je do pogreške prilikom spremanja podataka",
                "status": 500
            }), 500

    return jsonify({
        "data": {
            f"{Room.get_name_singular()}": room.to_dict()
        },
        "status": 201
    }), 201

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
        
        if request.is_json and "therapy_types" in request.json and isinstance(request.json["therapy_types"], list):
            try:
                types = []
                for therapy_type_id in request.json["therapy_types"]:
                    therapy_type = TherapyType.query.get(therapy_type_id)
                    if therapy_type:
                        db.session.add(therapy_type)
                        types.append(therapy_type)
                room.therapy_types = types
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                return jsonify({
                    "error": "Došlo je do pogreške prilikom spremanja podataka",
                    "status": 500
                }), 500


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