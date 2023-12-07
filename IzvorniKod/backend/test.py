import unittest
from flask import json
from models.accounts import User, Patient, Employee
from app import app, db
import os
import config

app.config['TESTING'] = True
current_directory = os.path.dirname(os.path.abspath(__file__))
db_file_path = os.path.join(current_directory, 'test_database.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_file_path
app.config['SECRET_KEY'] = config.SECRET_KEY

db.init_app(app)

employee_data = {
    'name': 'John',
    'surname': 'Doe',
    'email': 'json@example.com',
    'phone_number': '091 123 4567',
    'password': 'password',
    'date_of_birth': "1999-01-01",
    'OIB': '12345678901',
    'is_active': True,
    'is_admin': False
}

class FlaskAppTest(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

        with app.app_context():
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_get_user(self):
        user = User(name='John', surname='Doe', email='john@example.com', phone_number='091 123 4567', date_of_birth= "1999-01-01", password='password')
        with app.app_context():
            db.session.add(user)
            db.session.commit()

        response = self.app.get('/users/1')
        data = json.loads(response.get_data())
        data = data['data']['user']
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['name'], 'John')
        self.assertEqual(data['surname'], 'Doe')

    def test_get_employee(self):
        employee = Employee(name='John', 
                            surname='Doe', 
                            email='john@example.com', 
                            phone_number='091 123 4567', 
                            date_of_birth= "1999-01-01", 
                            password='password', 
                            OIB='12345678901',
                            is_active=True, 
                            is_admin=False
                            )
        
        with app.app_context():
            db.session.add(employee)
            db.session.commit()

        response = self.app.get('/users/1')
        data = json.loads(response.get_data())
        data = data['data']['employee']
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['name'], 'John')
        self.assertEqual(data['surname'], 'Doe')

    def test_get_users(self):
        user1 = User(name='John', surname='Doe', email='john@example.com', phone_number='091 123 4567', date_of_birth= "1999-01-01", password='password')
        user2 = User(name='Jane', surname='Doe', email='jane@example.com', phone_number='091 223 4567', date_of_birth= "1999-01-01", password='password')
        with app.app_context():
            db.session.add_all([user1, user2])
            db.session.commit()

        response = self.app.get('/users')
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 2)

    def test_post_user(self):
        data = {
            'name': 'John',
            'surname': 'Doe',
            'email': 'john@example.com',
            'phone_number': '091 123 4567',
            'date_of_birth': "1999-01-01",
            'password': 'password'
        }

        response = self.app.post('/users', json=data)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 405)

    def test_post_user_wrong_no_surname(self):
        data = {
            'name': 'John',
            'email': 'John@example.com',
            'phone_number': '091 123 4567',
            'date_of_birth': "1999-01-01",
            'password': 'password'
        }

        response = self.app.post('/users', json=data)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 405)

    def test_post_user_wrong_no_email(self):
        data = {
            'name': 'John',
            'phone_number': '091 123 4567',
            'password': 'password'
        }

        response = self.app.post('/users', json=data)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 405)


    # correct login
    def test_login(self):
        user = User(name='John', surname='Doe', email='john@example.com', phone_number='091 123 4567', date_of_birth= "1999-01-01", password='password')
        with app.app_context():
            db.session.add(user)
            db.session.commit()

        data = {
            'email': 'john@example.com',
            'password': 'password'
        }

        response = self.app.post('/login', json=data)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertIn('user_id', data['data'])

    # wrong login - email
    def test_login_wrong_email(self):
        user = User(name='John', surname='Doe', email='john@example.com', phone_number='091 123 4567', date_of_birth= "1999-01-01", password='password')
        with app.app_context():
            db.session.add(user)
            db.session.commit()

        data = {
            'email': 'blabla',
            'password': 'password'
        }

        response = self.app.post('/login', json=data)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 401)
        self.assertIn('error', data)

    # wrong login - password
    def test_login_wrong_password(self):
        user = User(name='John', surname='Doe', email='john@example.com', phone_number='091 123 4567', date_of_birth= "1999-01-01", password='password')
        with app.app_context():
            db.session.add(user)
            db.session.commit()

        data = {
            'email': 'json@example.com',
            'password': 'blabla'
        }

        response = self.app.post('/login', json=data)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 401)
        self.assertIn('error', data)

    # test register patient
    def test_register_patient(self):
        data = {
            'name': 'John',
            'surname': 'Doe',
            'email': 'json@example.com',
            'phone_number': '091 123 4567',
            'date_of_birth': "1990-01-01",
            'password': 'password',
            'MBO': '123456789'
        }

        response = self.app.post('/patients', json=data)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 201)
        self.assertIn('user_id', data['data'])

        # test database
        with app.app_context():
            user = User.query.filter_by(
                user_id=1
            ).first()
            self.assertEqual(user.name, 'John')
            self.assertEqual(user.surname, 'Doe')

            patient = Patient.query.filter_by(
                user_id=1
            ).first()
            self.assertEqual(patient.MBO, '123456789')

    # test register patient - wrong no surname
    def test_register_patient_wrong_no_surname(self):
        data = {
            'name': 'John',
            'email': 'json@example.com',
            'phone_number': '091 123 4567',
            'password': 'password',
            'date_of_birth': "1999-01-01",
            'MBO': '123456789'
        }

        response = self.app.post('/patients', json=data)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)

        # test database
        with app.app_context():
            user = User.query.filter_by(
                user_id=1
            ).first()
            self.assertEqual(user, None)
    
    # test register patient - wrong format date
    def test_register_employee_wrong_date(self):
        data = employee_data

        data['date_of_birth'] = "1999-01"
        response = self.app.post('/employees', json=data)
        print(response.response)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
    
    # test register employee - double OIB
    def test_register_employee_double_OIB(self):
        data = employee_data

        response = self.app.post('/employees', json=data)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 201)
        self.assertIn('user_id', data['data'])

        response = self.app.post('/employees', json=data)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)

if __name__ == '__main__':
    unittest.main()
