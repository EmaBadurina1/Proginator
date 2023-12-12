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
   return get_all(Model=Therapy)

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
   therapy = Therapy.query.get(therapy_id)

   if therapy:
      appointments = Appointment.query.filter_by(therapy_id=therapy_id)

      for appointment in appointments:
         db.session.delete(appointment)

      db.session.delete(therapy)
      db.session.commit()
      return jsonify({
         "message": "Deleted",
         "status": 200
      }), 200
   else:
      return jsonify({
         "error": f"No ID: {therapy_id}",
         "status": 404
      }), 404

# get list of therapy types
@therapies_bp.route('/therapy-types', methods=['GET'])
@auth_validation
def get_therapy_types():
   return get_all(Model=TherapyType)

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
   therapy_type = TherapyType.query.get(therapy_type_id)

   if therapy_type:
      therapies = Therapy.query.filter_by(therapy_type_id=therapy_type_id)

      for therapy in therapies:
         therapy.therapy_type_id = None

      db.session.delete(therapy_type)
      db.session.commit()
      return jsonify({
         "message": "Deleted",
         "status": 200
      }), 200
   else:
      return jsonify({
         "error": f"No ID: {therapy_type_id}",
         "status": 404
      }), 404