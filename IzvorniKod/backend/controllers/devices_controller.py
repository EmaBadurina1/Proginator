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
   return get_all(Model=Device)

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
    devices = Device.query.filter_by(device_type_id=device_type_id).all()
    list = [device.to_dict() for device in devices]
    return jsonify({
        "data": {
            "devices": list
        },
        "status": 200
    }), 200

# get list of device types
@devices_bp.route('/device-types', methods=['GET'])
@auth_validation
def get_device_types():
   return get_all(Model=DeviceType)

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