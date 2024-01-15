from flask import request, jsonify, session
from sqlalchemy.sql import exists
from db import db
from models import User, Patient, Employee
from auth import auth_validation
from utils.utils import *
from datetime import datetime
from dotenv import load_dotenv
from mail import mail
from flask_mail import Message
import os

# setup blueprint
from flask import Blueprint
auth_bp = Blueprint('auth_bp', __name__)

# login to system
@auth_bp.route('/login', methods=['POST'])
def login():
   # check if user is already logged in
   if 'user_id' in session:
      return jsonify({
         "error": "Već ste prijavljeni",
         "status": 400
      }), 400
   
   user: User = User.query.filter_by(email=request.json['email']).first()

   if user.confirmed == False:
      return jsonify({
         "message": "E-mail nije potvrđen",
         "status": 400
      }), 400

   if user and user.check_password(request.json['password']):
      session['user_id'] = user.user_id
      #print(session['user_id'])
      dict = user.to_dict()
      if db.session.query(exists().where(Patient.user_id == user.user_id)).scalar():
         dict["role"] = "patient"
      elif db.session.query(exists().where(Employee.user_id == user.user_id)).scalar():
         employee = Employee.query.get(user.user_id)
         if employee.is_admin == True:
            dict["role"] = "admin"
         else:
            dict["role"] = "doctor"
      else:
         dict["role"] = None

      # set role in session, so that it can be used in require_any_role decorator
      session["role"] = dict["role"]

      return jsonify({
         "data": {
            "user": dict
         },
         "message": "Prijava uspješna",
         "status": 200
      }), 200
   else:
      return jsonify({
         "error": "Pogrešna email adresa ili lozinka",
         "status": 401
      }), 401
    
# logout of system
@auth_bp.route('/logout', methods=['POST'])
@auth_validation
def logout():
   session.pop('user_id', None)
   session.pop('role', None)
   return jsonify({
      "message": "Odjava uspješna",
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
         "error": "Lozinke se ne podudaraju",
         "status": 400
      }), 400
   
   user = User.query.get(user_id)

   if not user.check_password(request.json["old_password"]):
      return jsonify({
         "error": "Pogrešna lozinka",
         "status": 400
      }), 400
   
   user.set_password(request.json["new_password"])
   db.session.commit()

   return jsonify({
      "message": "Lozinka uspješno promijenjena",
      "status": 200
   }), 200

@auth_bp.route('/confirm-email/<string:token>', methods=['GET'])
def confirm_email(token):
   email = confirm_token(token)
   if email == False:
      return jsonify({
         "message": "Link za potvrdu e-maila nije valjan ili je istekao",
         "status": 404
      }), 404
   user = User.query.filter_by(email=email).first()
   if user == None:
      return jsonify({
         "message": "Link za potvrdu e-maila nije valjan ili je istekao",
         "status": 404
      }), 404
   if user.confirmed:
      return jsonify({
         "message": "E-mail je već potvrđen",
         "status": 409
      }), 409
   user.confirmed = True
   user.confirmed_on = datetime.now()
   db.session.commit()
   return jsonify({
      "message": "Potvrdili ste svoj e-mail",
      "status": 200
   }), 200

@auth_bp.route('/resend-email', methods=['POST'])
def resend_email():
   if request.is_json and 'email' in request.json:
      email = request.json['email']
      load_dotenv()
      token = generate_token(email=email)
      url = os.getenv("FRONTEND_URL")
      url = url + "/confirm-email/" + token
      msg = Message(
         'E-mail verifikacija - RehApp',
         sender='proginator@fastmail.com',
         recipients=[email]
      )
      msg.body = "Za verifikaciju računa kliknite na poveznicu: " + url
      mail.send(msg)
      return jsonify({
         "message": "Link za verifikaciju je uspješno poslan na e-mail: " + email,
         "status": 200
      }), 200
   return jsonify({
      "error": "E-mail nije naveden",
      "status": 400
   }), 400

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
   if request.is_json and 'email' in request.json:
      email = request.json['email']
      user = User.query.filter(User.email == email).first()

      if user == None:
         return jsonify({
            "error": "E-mail " + email + " ne postoji u sustavu",
            "status": 404
         }), 404

      tmp_password = generate_password()
      user.set_password(tmp_password)
      db.session.commit()
      msg = Message(
         'Privremena lozinka - RehApp',
         sender='proginator@fastmail.com',
         recipients=[email]
      )
      msg.body = "Lozinku promijenite u postavkama nakon prve prijave u sustav.\nLozinka: " + tmp_password
      mail.send(msg)
      return jsonify({
         "message": "Privremena lozinka poslana je na email: " + email,
         "status": 200
      }), 200
   return jsonify({
      "error": "E-mail nije naveden",
      "status": 400
   }), 400

@auth_bp.route('/check-account/<string:email>', methods=['GET'])
def check_account(email):
   user = User.query.filter(User.email == email).first()
   if user:
      if user.confirmed:
         return jsonify({
            "error": "Korisnik je već potvrdio svoj e-mail",
            "status": 400
         }), 400
      return jsonify({
         "message": "Korsnik mora potvrditi svoj e-mail",
         "status": 200
      }), 200
   return jsonify({
      "error": "Ne postoji korisnik sa e-mailom: " + email,
      "status": 404
   }), 404