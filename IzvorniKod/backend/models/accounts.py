from datetime import datetime
from flask import jsonify, abort
import bcrypt  # Import the bcrypt library
from db import db
import bcrypt

# Define the User model
class User(db.Model):
    __tablename__ = '_user'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(30), unique=True, nullable=False)
    date_of_birth = db.Column(db.Date)
    hashed_password = db.Column(db.String(300), nullable=False)

    patients = db.relationship(
        'Patient',
        backref=db.backref(
            'user',
            passive_deletes=True
        ) 
    )

    employees = db.relationship(
        'Employee',
        backref=db.backref(
            'user',
            passive_deletes=True
        ) 
    )

    def __init__(self, password, **kwargs):
        date_of_birth = kwargs.get('date_of_birth', None)
        # test date format and convert to datetime
        try:
            date_of_birth = datetime.strptime(date_of_birth, '%Y-%m-%d')
            kwargs['date_of_birth'] = date_of_birth
        except ValueError:
            response = jsonify({'error': 'Pogrešan datum. Format mora biti YYYY-MM-DD'})
            response.status_code = 400
            return abort(response)

        super().__init__(**kwargs)
        self.set_password(password)

    def __repr__(self):
        return f'<User {self.name} {self.surname}>'
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'name': self.name,
            'surname': self.surname,
            'email': self.email,
            'phone_number': self.phone_number,
            'date_of_birth': self.date_of_birth,
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
        self.hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode()
    
    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.hashed_password.encode('utf-8'))
        
    @staticmethod
    def get_name_singular():
        return "user"
    
    @staticmethod
    def get_name_plural():
        return "users"

# inheritance from User
class Patient(User):
    __tablename__ = 'patient'
    user_id = db.Column(
        db.Integer,
        db.ForeignKey(
            '_user.user_id',
            ondelete="CASCADE",
            onupdate="CASCADE"
        ),
        primary_key=True,
        nullable=False
    )
    MBO = db.Column(db.String(9), unique=True, nullable=False, name='mbo')

    therapies = db.relationship(
        'Therapy',
        backref=db.backref(
            'patient',
            passive_deletes=True
        ) 
    )

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

    @staticmethod
    def get_name_singular():
        return "patient"
    
    @staticmethod
    def get_name_plural():
        return "patients"


class Employee(User):
    __tablename__ = 'employee'
    user_id = db.Column(
        db.Integer,
        db.ForeignKey(
            '_user.user_id',
            ondelete="CASCADE",
            onupdate="CASCADE"
        ),
        primary_key=True,
        nullable=False
    )
    OIB = db.Column(db.String(11), unique=True, nullable=False, name='oib')
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)

    appointments = db.relationship(
        'Appointment',
        backref=db.backref(
            'doctor',
            passive_deletes=True
        ) 
    )

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
            self.OIB = kwargs.get('OIB', None)
        if 'is_active' in kwargs:
            self.is_active = kwargs.get('is_active', None)
        if 'is_admin' in kwargs:
            self.is_admin = kwargs.get('is_admin', None)
        super().update(**kwargs)

    @staticmethod
    def get_name_singular():
        return "employee"
    
    @staticmethod
    def get_name_plural():
        return "employees"
