import jwt
from datetime import datetime, timedelta
import config
from flask import abort, jsonify
from functools import wraps
from flask import request, session
from flask import current_app as app

def generate_token(user_id):
    expiration_time = datetime.utcnow() + timedelta(days=1)  # Token expiration time
    payload = {
        'user_id': user_id,
        'exp': expiration_time
    }
    token = jwt.encode(payload, config.SECRET_KEY, algorithm='HS256')
    return token

def validate_token(token):
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=['HS256'])

        if not payload:
            invalid_token_response = jsonify({'error': 'Token is invalid'})
            invalid_token_response.status_code = 401
            abort(invalid_token_response)

        return payload
    
    except jwt.ExpiredSignatureError:
        expired_token_response = jsonify({'error': 'Token has expired'})
        expired_token_response.status_code = 401
        abort(expired_token_response)

    except jwt.InvalidTokenError:
        invalid_token_response = jsonify({'error': 'Token is invalid'})
        invalid_token_response.status_code = 401
        abort(invalid_token_response)


def auth(f):
    '''
    Decorator that checks if a token is provided in the request header.
    If a token is provided, it is validated and the user_id is extracted from it.
    The user_id is then passed to the decorated function as an first argument (auth_user_id).
    '''
    @wraps(f)
    def wrapper(*args, **kwargs):
        if app.config['TESTING']:
            auth_user_id = 1
            return f(auth_user_id, *args, **kwargs)

        token = session.get('Authorization')

        if not token:
            no_token_response = jsonify({'error': 'No token provided'})
            no_token_response.status_code = 401
            return abort(no_token_response)
        
        payload = validate_token(token)

        auth_user_id = payload['user_id']
        return f(auth_user_id, *args, **kwargs)
    return wrapper