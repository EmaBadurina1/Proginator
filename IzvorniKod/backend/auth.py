import jwt
from datetime import datetime, timedelta
from flask import abort, jsonify
from functools import wraps
from flask import request, session
from flask import current_app as app


def auth_validation(f):
    '''
    Decorator that checks if the user is logged in.
    '''
    @wraps(f)
    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            response = jsonify({"message": "Missing authorization"})
            response.status_code = 401
            abort(response)
        return f(*args, **kwargs)
    return wrapper