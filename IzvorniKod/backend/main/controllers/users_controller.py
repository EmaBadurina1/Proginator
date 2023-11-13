
from flask import Blueprint, jsonify, request
from ...app import db
from ..models.user import User

users_bp = Blueprint('users', __name__, url_prefix='/users')


@users_bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@users_bp.route('/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    return jsonify(user.to_dict())

@users_bp.route('/', methods=['POST'])
def create_user():
    user = User(**request.json)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201