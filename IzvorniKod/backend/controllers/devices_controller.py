from controllers.crud_template import *
from models import *
from auth import auth_validation

# setup blueprint
from flask import Blueprint
devices_bp = Blueprint('devices_bp', __name__)

# get list of devices
@devices_bp.route('/devices', methods=['GET'])
@auth_validation
def get_devices():
   return get_all(Model=Device, req=request.json if request.content_type == 'application/json' else {})

# get device with id=device_id
@devices_bp.route('/devices/<int:device_id>', methods=['GET'])
@auth_validation
def get_device(device_id):
   return get_one(id=device_id, Model=Device)

# create new device
@devices_bp.route('/devices', methods=['POST'])
@auth_validation
def create_device():
   required_fields = ['device_type_id']
   return create(required_fields=required_fields, Model=Device)

# update device with id=device_id
@devices_bp.route('/devices/<int:device_id>', methods=['PATCH'])
@auth_validation
def update_device(device_id):
   return update(id=device_id, Model=Device)
    
# delete device with id=device_id
@devices_bp.route('/devices/<int:device_id>', methods=['DELETE'])
@auth_validation
def delete_device(device_id):
   return delete(id=device_id, Model=Device)

# get list of devices by device_type
@devices_bp.route('/devices/by-type/<int:device_type_id>', methods=['GET'])
@auth_validation
def get_by_device_type(device_type_id):
   try:
      page = 1
      page_size = 20

      if request.content_type == 'application/json':
         req = request.json
      else:
         req = {}

      if 'page' in req:
         page = req.get('page')
      if 'page_size' in req:
         page_size = req.get('page_size')
      if page_size > 20 or page_size < 1:
         return jsonify({
         "error": "Page size must be between 1 and 20",
         "status": 400
         }), 400

      devices = (
         Device
         .query
         .filter_by(device_type_id=device_type_id)
         .paginate(page=page, per_page=page_size, error_out=False)
      )

      if devices.pages == 0:
         return jsonify({
         "data": {
            "devices": []
         },
         "page": 0,
         "page_size": page_size,
         "pages": devices.pages,
         "status": 200
      }), 200

      if page > devices.pages or page < 1:
         return jsonify({
            'error': 'Requested page does not exist',
            'status': 404
         }), 404

      return jsonify({
         "data": {
            "devices": [device.to_dict() for device in devices.items]
         },
         "page": page,
         "page_size": page_size,
         "pages": devices.pages,
         "status": 200
      }), 200
   except Exception as e:
      return jsonify({
         "error": "Page and page size must be integers",
         "status": 400
      }), 400

# get list of device types
@devices_bp.route('/device-types', methods=['GET'])
@auth_validation
def get_device_types():
   return get_all(Model=DeviceType, req=request.json if request.content_type == 'application/json' else {})

# get device types with id=device_type_id
@devices_bp.route('/device-types/<int:device_type_id>', methods=['GET'])
@auth_validation
def get_device_type(device_type_id):
   return get_one(id=device_type_id, Model=DeviceType)

# create new device type
@devices_bp.route('/device-types', methods=['POST'])
@auth_validation
def create_device_type():
   required_fields = ['device_type_name']
   return create(required_fields=required_fields, Model=DeviceType)

# update device type with id=device_type_id
@devices_bp.route('/device-types/<int:device_type_id>', methods=['PATCH'])
@auth_validation
def update_device_type(device_type_id):
   return update(id=device_type_id, Model=DeviceType)
    
# delete device type with id=device_type_id
@devices_bp.route('/device-types/<int:device_type_id>', methods=['DELETE'])
@auth_validation
def delete_device_type(device_type_id):
   return delete(id=device_type_id, Model=DeviceType)