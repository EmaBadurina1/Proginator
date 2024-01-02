from flask import abort, jsonify, session
from functools import wraps


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

def require_any_role(*roles):
    '''
    Decorator that checks if the user has any of the required roles. Takes a list of arguments as roles.
    '''
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):

            if "role" not in session or session["role"] not in roles:
                print(session)
                response = jsonify({"message": "You don't have any of the required roles: " + ", ".join(roles)})
                response.status_code = 401
                abort(response)
            return f(*args, **kwargs)
        return wrapper
    return decorator