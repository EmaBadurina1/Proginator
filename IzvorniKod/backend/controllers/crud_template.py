from flask import request, jsonify
from sqlalchemy.exc import IntegrityError, DataError
from db import db

def validate_required_fields(data, required_fields):
   missing_fields = [field for field in required_fields if field not in data]
   return missing_fields

# get list of all rows of entity
def get_all(Model):
   rows = Model.query.all()
   list = [row.to_dict() for row in rows]
   return jsonify({
      "data": list,
      "status": 200
   }), 200

# get a row by id
def get_one(id, Model):
   row = Model.query.get(id);
   if row: 
      return jsonify({
         f"{Model.__name__.lower()}": row.to_dict(),
         "status": 200
      }), 200
   else:
      return jsonify({
         "error": f"No ID: {id}",
         "status": 404
      }), 404

# create new row
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
         "status": 400
      }), 400
   
   row_id = getattr(row, f"{Model.__name__.lower()}_id")

   return jsonify({
      "data": {
         f"{Model.__name__.lower()}_id": row_id
      },
      "status": 201
   }), 201

# update row
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
            "status": 400
         }), 400
      return jsonify({
         f"{Model.__name__.lower()}": row.to_dict(), 
         "status": 200
      }), 200
   else:
      return jsonify({
         "error": f"No ID: {id}",
         "status": 404
      }), 404
   
# delete row
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