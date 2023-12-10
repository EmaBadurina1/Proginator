from datetime import datetime
from flask import jsonify, abort
import bcrypt  # Import the bcrypt library
from db import db
import bcrypt

# Define the User model
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    surname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(80), unique=True, nullable=False)
    date_of_birth = db.Column(db.Date)
    hashed_password = db.Column(db.String(300), nullable=False)

    def __init__(self, password, **kwargs):
        date_of_birth = kwargs.get('date_of_birth', None)

        # test date format and convert to datetime
        try:
            date_of_birth = datetime.strptime(date_of_birth, '%Y-%m-%d')
            kwargs['date_of_birth'] = date_of_birth
        except ValueError:
            response = jsonify({'error': 'Pogrešan datum. Format mroa biti YYYY-MM-DD'})
            response.status_code = 400
            return abort(response)

        super().__init__(**kwargs)
        self.set_password(password)

    def __repr__(self):
        return f'<User {self.username}>'
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'name': self.name,
            'surname': self.surname,
            'email': self.email,
            'phone_number': self.phone_number,
            'date_of_birth': self.date_of_birth
        }
    
    def update(self, **kwargs):
        if 'name' in kwargs:
            self.name = kwargs.get('name', None)
        if 'surname' in kwargs:
            self.surname = kwargs.get('surname', None)
        if 'email' in kwargs:
            self.email = kwargs.get('email', None)
        if 'phone_number' in kwargs:
            self.phone_number = kwargs.get('phone_number', None)
        if 'date_of_birth' in kwargs:
            self.date_of_birth = kwargs.get('date_of_birth', None)

    def set_password(self, password):
        #salt = os.getenv("SALT")
        #salt = salt.encode('utf-8')
        #res = password.encode('utf-8')
        #self.hashed_password = bcrypt.hashpw(res, salt).decode('utf-8')
        res = password.encode('utf-8')
        self.hashed_password = bcrypt.hashpw(res, bcrypt.gensalt()).decode()
    
    def check_password(self, password):
        #hashed_password = self.hashed_password.encode('utf-8')
        #password = password.encode('utf-8')
        #return bcrypt.checkpw(password, hashed_password)
        return bcrypt.checkpw(password.encode('utf-8'), self.hashed_password.encode('utf-8'))

# inheritence from User
class Patient(User):
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), primary_key=True, nullable=False)
    MBO = db.Column(db.String(80), unique=True, nullable=False)

    def __init__(self, MBO, **kwargs):
        super().__init__(**kwargs)
        self.MBO = MBO

    def to_dict(self):
        user_dict = super().to_dict()
        user_dict['MBO'] = self.MBO

        return user_dict
    
    def update(self, **kwargs):
        if 'MBO' in kwargs:
            self.MBO = kwargs.get('MBO', None)
        super().update(**kwargs)


class Employee(User):
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), primary_key=True, nullable=False)
    OIB = db.Column(db.String(11), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, nullable=False)
    is_admin = db.Column(db.Boolean, nullable=False)

    def __init__(self, is_active, is_admin, OIB, **kwargs):
        super().__init__(**kwargs)
        self.is_active = is_active
        self.is_admin = is_admin
        self.OIB = OIB
    
    def to_dict(self):
        user_dict = super().to_dict()

        user_dict['is_active'] = self.is_active
        user_dict['is_admin'] = self.is_admin
        user_dict['OIB'] = self.OIB

        return user_dict
    
    def update(self, **kwargs):
        if 'OIB' in kwargs:
            self.OIB = kwargs.get('MBO', None)
        if 'is_active' in kwargs:
            self.is_active = kwargs.get('is_active', None)
        if 'is_admin' in kwargs:
            self.is_admin = kwargs.get('is_admin', None)
        super().update(**kwargs)
