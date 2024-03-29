from controllers.crud_template import *
from models import *
from auth import auth_validation, require_any_role
import psycopg2

# setup blueprint
from flask import Blueprint
devices_bp = Blueprint('devices_bp', __name__)

# get list of devices
@devices_bp.route('/devices', methods=['GET'])
@auth_validation
@require_any_role('admin')
def get_devices():
   return get_all(Model=Device, request=request)

# get device with id=device_id
@devices_bp.route('/devices/<int:device_id>', methods=['GET'])
@auth_validation
@require_any_role('admin', 'doctor', 'patient')
def get_device(device_id):
   return get_one(id=device_id, Model=Device)

# create new device
@devices_bp.route('/devices', methods=['POST'])
@auth_validation
@require_any_role('admin')
def create_device():
   required_fields = ['device_type_id']
   return create(required_fields=required_fields, Model=Device)

# update device with id=device_id
@devices_bp.route('/devices/<int:device_id>', methods=['PATCH'])
@auth_validation
@require_any_role('admin')
def update_device(device_id):
   return update(id=device_id, Model=Device)
    
# delete device with id=device_id
@devices_bp.route('/devices/<int:device_id>', methods=['DELETE'])
@auth_validation
@require_any_role('admin')
def delete_device(device_id):
   return delete(id=device_id, Model=Device)

# get list of devices by device_type
@devices_bp.route('/devices/by-type/<int:device_type_id>', methods=['GET'])
@auth_validation
@require_any_role('admin')
def get_by_device_type(device_type_id):
   try:
      page = request.args.get('page', default = 1, type = int)
      page_size = request.args.get('page_size', default = 20, type = int)
      order_by = request.args.get('order_by', default="therapy_id", type=str)
      order = request.args.get('order', default="asc", type=str)
      search = request.args.get('search', default="", type=str)

      if page_size > 20 or page_size < 1:
         return jsonify({
               "error": "Page size must be between 1 and 20",
               "status": 400
         }), 400

      valid_columns = Device.get_column_names()

      order_by = order_by if order_by in valid_columns else Device.get_pk_column_name()

      if order.lower() not in ['asc', 'desc']:
         order = 'asc'

      order_column = getattr(Device, order_by)
      if order.lower() == 'desc':
         order_column = order_column.desc()

      if search == "":
         devices = (Device
            .query
            .filter_by(device_type_id=device_type_id)
            .order_by(order_column)
            .paginate(page=page, per_page=page_size, error_out=False)
         )
      else:
         devices = (Device
            .query
            .filter_by(device_type_id=device_type_id)
            .filter(Device.get_search_filter(search=search))
            .order_by(order_column)
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
         "status": 200,
         "total": devices.total
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
         "status": 200,
         "total": devices.total
      }), 200
   
   except psycopg2.OperationalError as e:
      return jsonify({
         "error": "There was a problem with connection on server side",
         "status": 500
      }), 500
   except Exception as e:
      return jsonify({
         "error": "Page and page size must be integers and order, order_by and search must be strings",
         "status": 400
      }), 400

# get list of device types
@devices_bp.route('/device-types', methods=['GET'])
@auth_validation
@require_any_role('admin')
def get_device_types():
   return get_all(Model=DeviceType, request=request)

# get device types with id=device_type_id
@devices_bp.route('/device-types/<int:device_type_id>', methods=['GET'])
@auth_validation
@require_any_role('admin')
def get_device_type(device_type_id):
   return get_one(id=device_type_id, Model=DeviceType)

# create new device type
@devices_bp.route('/device-types', methods=['POST'])
@auth_validation
@require_any_role('admin')
def create_device_type():
   required_fields = ['device_type_name']
   return create(required_fields=required_fields, Model=DeviceType)

# update device type with id=device_type_id
@devices_bp.route('/device-types/<int:device_type_id>', methods=['PATCH'])
@auth_validation
@require_any_role('admin')
def update_device_type(device_type_id):
   return update(id=device_type_id, Model=DeviceType)
    
# delete device type with id=device_type_id
@devices_bp.route('/device-types/<int:device_type_id>', methods=['DELETE'])
@auth_validation
@require_any_role('admin')
def delete_device_type(device_type_id):
   return delete(id=device_type_id, Model=DeviceType)