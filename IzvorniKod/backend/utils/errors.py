
from flask import jsonify

def ForbiddenError(message="Forbidden"):
    return jsonify({
        "status": 403,
        "message": message
    }), 403

def NotFoundError(message="Not found"):
    return jsonify({
        "status": 404,
        "message": message
    }), 404

def BadRequestError(message="Bad request"):
    return jsonify({
        "status": 400,
        "message": message
    }), 400

def ConflictError(message="Conflict"):
    return jsonify({
        "status": 409,
        "message": message
    }), 409

def UnauthorizedError(message="Unauthorized"):
    return jsonify({
        "status": 401,
        "message": message
    }), 401

def ServerError(message="Server error"):
    return jsonify({
        "status": 500,
        "message": message
    }), 500