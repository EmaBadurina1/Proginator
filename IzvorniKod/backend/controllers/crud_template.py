from flask import request, jsonify
from sqlalchemy.exc import IntegrityError, DataError
from db import db
from utils.utils import validate_required_fields
import psycopg2

# get page of entities
# methods=['GET']
def get_all(Model, request):
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
      
      valid_columns = Model.get_column_names()

      order_by = order_by if order_by in valid_columns else Model.get_pk_column_name()

      if order.lower() not in ['asc', 'desc']:
         order = 'asc'

      order_column = getattr(Model, order_by)
      if order.lower() == 'desc':
         order_column = order_column.desc()

      if search == "":
         values = (Model
            .query
            .order_by(order_column)
            .paginate(page=page, per_page=page_size, error_out=False)
         )
      else:
         values = (Model
            .query
            .filter(Model.get_search_filter(search=search))
            .order_by(order_column)
            .paginate(page=page, per_page=page_size, error_out=False)
         )

      if values.pages == 0:
         return jsonify({
            "data": {
                  f"{Model.get_name_plural()}": []
            },
            "page": 0,
            "page_size": page_size,
            "pages": values.pages,
            "status": 200,
            "total": values.total
         }), 200

      if page > values.pages or page < 1:
         return jsonify({
               'error': 'Requested page does not exist',
               'status': 404
         }), 404

      return jsonify({
         "data": {
               f"{Model.get_name_plural()}": [item.to_dict() for item in values.items]
         },
         "page": page,
         "page_size": page_size,
         "pages": values.pages,
         "status": 200,
         "total": values.total
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