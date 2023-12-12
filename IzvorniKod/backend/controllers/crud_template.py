from flask import request, jsonify
from sqlalchemy.exc import IntegrityError, DataError
from db import db
from utils.utils import validate_required_fields

# get list of all rows of entity
# methods=['GET']
def get_all(Model):
   rows = Model.query.all()
   list = [row.to_dict() for row in rows]
   return jsonify({
      "data": {
         f"{Model.get_name_plural()}": list
      },
      "status": 200
   }), 200

# get a row by id
# methods=['GET']
def get_one(id, Model):
   row = Model.query.get(id);
   if row:
      return jsonify({
         "data": {
            f"{Model.get_name_singular()}": row.to_dict()
         },
         "status": 200
      }), 200
   else:
      return jsonify({
         "error": f"No ID: {id}",
         "status": 404
      }), 404

# create new row
# methods=['POST']
def create(required_fields, Model):
   missing_fields = validate_required_fields(request.json, required_fields)

   if missing_fields:
      error_message = f"Missing required fields: {', '.join(missing_fields)}"
      return jsonify({
         "error": error_message,
         "status": 400
      }), 400
   
   row = Model(**request.json)

   try:
      db.session.add(row)
      db.session.commit()
   except (ValueError, IntegrityError, DataError) as e:
      db.session.rollback()
      return jsonify({
         "error": "Invalid input",
         "status": 400
      }), 400
   except Exception as e:
      db.session.rollback()
      return jsonify({
         "error": "There was a problem storing your data",
         "status": 500
      }), 500

   return jsonify({
      "data": {
         f"{Model.get_name_singular()}": row.to_dict()
      },
      "status": 201
   }), 201

# update row
# methods=['PATCH']
def update(id, Model):
   row = Model.query.get(id)
   if row:
      try:
         row.update(**request.json)
         db.session.commit()
      except (ValueError, IntegrityError, DataError) as e:
         db.session.rollback()
         return jsonify({
            "error": f"Invalid input: {str(e)}",
            "status": 400
         }), 400
      except Exception as e:
         db.session.rollback()
         return jsonify({
            "error": "There was a problem storing your data",
            "status": 500
         }), 500
      return jsonify({
         "data": {
            f"{Model.get_name_singular()}": row.to_dict()
         },
         "status": 200
      }), 200
   else:
      return jsonify({
         "error": f"No ID: {id}",
         "status": 404
      }), 404
   
# delete row
# methods=['DELETE']
def delete(id, Model):
   row = Model.query.get(id)

   if row:
      db.session.delete(row)
      db.session.commit()
      return jsonify({
         "message": "Deleted",
         "status": 200
      }), 200
   else:
      return jsonify({
         "error": f"No ID: {id}",
         "status": 404
      }), 404