from controllers.crud_template import *
from models import *
from auth import auth_validation

# setup blueprint
from flask import Blueprint
therapies_bp = Blueprint('therapies_bp', __name__)

# get list of therapies
@therapies_bp.route('/therapies', methods=['GET'])
@auth_validation
def get_therapies():
   return get_all(Model=Therapy, req=request.json if request.content_type == 'application/json' else {})

# get therapy with id=therapy_id
@therapies_bp.route('/therapies/<int:therapy_id>', methods=['GET'])
@auth_validation
def get_therapy(therapy_id):
   return get_one(id=therapy_id, Model=Therapy)

# create new therapy
@therapies_bp.route('/therapies', methods=['POST'])
@auth_validation
def create_therapy():
   required_fields = ['doctor_id', 'disease_descr', 'patient_id', 'date_from']
   return create(required_fields=required_fields, Model=Therapy)

# update therapy with id=therapy_id
@therapies_bp.route('/therapies/<int:therapy_id>', methods=['PATCH'])
@auth_validation
def update_therapy(therapy_id):
   return update(id=therapy_id, Model=Therapy)
    
# delete therapy with id=therapy_id
@therapies_bp.route('/therapies/<int:therapy_id>', methods=['DELETE'])
@auth_validation
def delete_therapy(therapy_id):
   return delete(id=therapy_id, Model=Therapy)

# get list of therapies by therapy_type
@therapies_bp.route('/therapies/by-type/<int:therapy_type_id>', methods=['GET'])
@auth_validation
def get_by_therapy_type(therapy_type_id):
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
         "status": 200
      }), 200

      if page > therapies.pages or page < 1:
         return jsonify({
            'error': 'Requested page does not exist',
            'status': 404
         }), 404

      return jsonify({
         "data": {
            "therapies": [therapy.to_dict() for therapy in therapies.items]
         },
         "page": page,
         "page_size": page_size,
         "pages": therapies.pages,
         "status": 200
      }), 200
   except Exception as e:
      return jsonify({
         "error": "Page and page size must be integers",
         "status": 400
      }), 400

# get list of therapies by patient
@therapies_bp.route('/therapies/by-patient/<int:user_id>', methods=['GET'])
@auth_validation
def get_by_patient(user_id):
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
         "status": 200
      }), 200

      if page > therapies.pages or page < 1:
         return jsonify({
            'error': 'Requested page does not exist',
            'status': 404
         }), 404

      return jsonify({
         "data": {
            "therapies": [therapy.to_dict() for therapy in therapies.items]
         },
         "page": page,
         "page_size": page_size,
         "pages": therapies.pages,
         "status": 200
      }), 200
   except Exception as e:
      return jsonify({
         "error": "Page and page size must be integers",
         "status": 400
      }), 400

# get list of therapy types
@therapies_bp.route('/therapy-types', methods=['GET'])
@auth_validation
def get_therapy_types():
   return get_all(Model=TherapyType, req=request.json if request.content_type == 'application/json' else {})

# get therapy types with id=therapy_type_id
@therapies_bp.route('/therapy-types/<int:therapy_type_id>', methods=['GET'])
@auth_validation
def get_therapy_type(therapy_type_id):
   return get_one(id=therapy_type_id, Model=TherapyType)

# create new therapy type
@therapies_bp.route('/therapy-types', methods=['POST'])
@auth_validation
def create_therapy_type():
   required_fields = ['therapy_type_name']
   return create(required_fields=required_fields, Model=TherapyType)

# update therapy type with id=therapy_type_id
@therapies_bp.route('/therapy-types/<int:therapy_type_id>', methods=['PATCH'])
@auth_validation
def update_therapy_type(therapy_type_id):
   return update(id=therapy_type_id, Model=TherapyType)
    
# delete therapy type with id=therapy_type_id
@therapies_bp.route('/therapy-types/<int:therapy_type_id>', methods=['DELETE'])
@auth_validation
def delete_therapy_type(therapy_type_id):
   return delete(id=therapy_type_id, Model=TherapyType)