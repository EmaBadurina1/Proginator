from flask import request, jsonify, session
from sqlalchemy.sql import exists
from db import db
from models import *
from auth import auth_validation
from utils.utils import *

# setup blueprint
from flask import Blueprint
auth_bp = Blueprint('auth_bp', __name__)

# login to system
@auth_bp.route('/login', methods=['POST'])
def login():
   user: User = User.query.filter_by(email=request.json['email']).first()
   if user and user.check_password(request.json['password']):
      session['user_id'] = user.user_id
      #print(session['user_id'])
      dict = user.to_dict()
      if user.role == "":
         dict["role"] = None
      else:
         dict["role"] = user.role

      return jsonify({
         "data": {
            "user": dict
         },
         "message": "Login successful",
         "status": 200
      }), 200
   else:
      return jsonify({
         "error": "Invalid username or password",
         "status": 401
      }), 401
    
# logout of system
@auth_bp.route('/logout', methods=['POST'])
@auth_validation
def logout():
   session.pop('user_id', None)
   return jsonify({
      "message": "Logout successful",
      "status": 200
   }), 200

# change user password
@auth_bp.route('/users/<int:user_id>/password', methods=['PATCH'])
@auth_validation
def change_password(user_id):
   required_fields = [
      "old_password",
      "new_password",
      "new_password_rep"
   ]

   missing_fields = validate_required_fields(request.json, required_fields)
   if missing_fields:
      error_message = f"Missing fields: {', '.join(missing_fields)}"
      return jsonify({
         "error": error_message,
         "status": 400
      }), 400
   
   if request.json["new_password"] != request.json["new_password_rep"]:
      return jsonify({
         "error": "Passwords are not the same",
         "status": 400
      }), 400
   
   user = User.query.get(user_id);

   if not user.check_password(request.json["old_password"]):
      return jsonify({
         "error": "Wrong password",
         "status": 400
      }), 400
   
   user.set_password(request.json["new_password"])
   db.session.commit()

   return jsonify({
      "message": "Password changed",
      "status": 200
   }), 200