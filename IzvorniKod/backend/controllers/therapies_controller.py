from controllers.crud_template import *
from models import *
from auth import auth_validation, require_any_role

# setup blueprint
from flask import Blueprint
therapies_bp = Blueprint('therapies_bp', __name__)

# get list of therapies
@therapies_bp.route('/therapies', methods=['GET'])
@auth_validation
@require_any_role('admin')
def get_therapies():
   try:
      page = request.args.get('page', default = 1, type = int)
      page_size = request.args.get('page_size', default = 20, type = int)
      order_by = request.args.get('order_by', default="therapy_id", type=str)
      order = request.args.get('order', default="asc", type=str)

      if page_size > 20 or page_size < 1:
         return jsonify({
            "error": "Page size must be between 1 and 20",
            "status": 400
         }), 400
      
      valid_columns = [
         'therapy_id',
         'doctor_id',
         'disease_descr',
         'req_treatment',
         'date_from',
         'date_to',
         'patient_id',
         'therapy_type_id'
      ]

      order_by = order_by if order_by in valid_columns else 'therapy_id'

      if order.lower() not in ['asc', 'desc']:
         order = 'asc'

      order_column = getattr(Therapy, order_by)
      if order.lower() == 'desc':
         order_column = order_column.desc()

      therapies = (Therapy
         .query
         .order_by(order_column)
         .paginate(page=page, per_page=page_size, error_out=False)
      )

      if therapies.pages == 0:
         return jsonify({
            "data": {
                  f"{Therapy.get_name_plural()}": []
            },
            "page": 0,
            "page_size": page_size,
            "pages": therapies.pages,
            "status": 200,
            "elements": therapies.total
         }), 200

      if page > therapies.pages or page < 1:
         return jsonify({
               'error': 'Requested page does not exist',
               'status': 404
         }), 404

      return jsonify({
         "data": {
               f"{Therapy.get_name_plural()}": [therapy.to_dict_simple() for therapy in therapies.items]
         },
         "page": page,
         "page_size": page_size,
         "pages": therapies.pages,
         "status": 200,
         "elements": therapies.total
      }), 200

   except Exception as e:
      return jsonify({
         "error": "Page and page size must be integers",
         "status": 400
      }), 400

# get therapy with id=therapy_id
@therapies_bp.route('/therapies/<int:therapy_id>', methods=['GET'])
@auth_validation
@require_any_role('admin', 'doctor', 'patient')
def get_therapy(therapy_id):
   return get_one(id=therapy_id, Model=Therapy)

# create new therapy
@therapies_bp.route('/therapies', methods=['POST'])
@auth_validation
@require_any_role('patient')
def create_therapy():
   required_fields = ['doctor_id', 'disease_descr', 'patient_id', 'date_from']
   return create(required_fields=required_fields, Model=Therapy)

# update therapy with id=therapy_id
@therapies_bp.route('/therapies/<int:therapy_id>', methods=['PATCH'])
@auth_validation
@require_any_role('admin', 'doctor', 'patient')
def update_therapy(therapy_id):
   return update(id=therapy_id, Model=Therapy)
    
# delete therapy with id=therapy_id
@therapies_bp.route('/therapies/<int:therapy_id>', methods=['DELETE'])
@auth_validation
@require_any_role('admin', 'patient')
def delete_therapy(therapy_id):
   return delete(id=therapy_id, Model=Therapy)

# get list of therapies by therapy_type
@therapies_bp.route('/therapies/by-type/<int:therapy_type_id>', methods=['GET'])
@auth_validation
@require_any_role('admin')
def get_by_therapies_type(therapy_type_id):
   try:
      page = request.args.get('page', default = 1, type = int)
      page_size = request.args.get('page_size', default = 20, type = int)

      if page_size > 20 or page_size < 1:
         return jsonify({
               "error": "Page size must be between 1 and 20",
               "status": 400
         }), 400

      therapies = (
         Therapy
         .query
         .filter_by(therapy_type_id=therapy_type_id)
         .paginate(page=page, per_page=page_size, error_out=False)
      )

      if therapies.pages == 0:
         return jsonify({
         "data": {
            "therapies": []
         },
         "page": 0,
         "page_size": page_size,
         "pages": therapies.pages,
         "status": 200,
         "elements": therapies.total
      }), 200

      if page > therapies.pages or page < 1:
         return jsonify({
            'error': 'Requested page does not exist',
            'status': 404
         }), 404

      return jsonify({
         "data": {
            "therapies": [therapy.to_dict_simple() for therapy in therapies.items]
         },
         "page": page,
         "page_size": page_size,
         "pages": therapies.pages,
         "status": 200,
         "elements": therapies.total
      }), 200
   except Exception as e:
      return jsonify({
         "error": "Page and page size must be integers",
         "status": 400
      }), 400

# get list of therapies by patient
@therapies_bp.route('/therapies/by-patient/<int:user_id>', methods=['GET'])
@auth_validation
@require_any_role('admin', 'patient')
def get_by_therapies_patient(user_id):
   try:
      page = request.args.get('page', default = 1, type = int)
      page_size = request.args.get('page_size', default = 20, type = int)

      if page_size > 20 or page_size < 1:
         return jsonify({
               "error": "Page size must be between 1 and 20",
               "status": 400
         }), 400

      therapies = (
         Therapy
         .query
         .filter_by(patient_id=user_id)
         .paginate(page=page, per_page=page_size, error_out=False)
      )

      if therapies.pages == 0:
         return jsonify({
         "data": {
            "therapies": []
         },
         "page": 0,
         "page_size": page_size,
         "pages": therapies.pages,
         "status": 200,
         "elements": therapies.total
      }), 200

      if page > therapies.pages or page < 1:
         return jsonify({
            'error': 'Requested page does not exist',
            'status': 404
         }), 404

      return jsonify({
         "data": {
            "therapies": [therapy.to_dict_simple() for therapy in therapies.items]
         },
         "page": page,
         "page_size": page_size,
         "pages": therapies.pages,
         "status": 200,
         "elements": therapies.total
      }), 200
   except Exception as e:
      return jsonify({
         "error": "Page and page size must be integers",
         "status": 400
      }), 400

# get list of therapy types
@therapies_bp.route('/therapy-types', methods=['GET'])
@auth_validation
@require_any_role('admin', 'patient', 'doctor')
def get_therapy_types():
   return get_all(Model=TherapyType, request=request)

# get therapy types with id=therapy_type_id
@therapies_bp.route('/therapy-types/<int:therapy_type_id>', methods=['GET'])
@auth_validation
@require_any_role('admin')
def get_therapy_type(therapy_type_id):
   return get_one(id=therapy_type_id, Model=TherapyType)

# create new therapy type
@therapies_bp.route('/therapy-types', methods=['POST'])
@auth_validation
@require_any_role('admin')
def create_therapy_type():
   required_fields = ['therapy_type_name']
   return create(required_fields=required_fields, Model=TherapyType)

# update therapy type with id=therapy_type_id
@therapies_bp.route('/therapy-types/<int:therapy_type_id>', methods=['PATCH'])
@auth_validation
@require_any_role('admin')
def update_therapy_type(therapy_type_id):
   return update(id=therapy_type_id, Model=TherapyType)
    
# delete therapy type with id=therapy_type_id
@therapies_bp.route('/therapy-types/<int:therapy_type_id>', methods=['DELETE'])
@auth_validation
@require_any_role('admin')
def delete_therapy_type(therapy_type_id):
   return delete(id=therapy_type_id, Model=TherapyType)