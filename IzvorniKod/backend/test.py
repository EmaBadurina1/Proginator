import unittest
from flask import json
from app import app, db, User

class FlaskAppTest(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app = app.test_client()

        with app.app_context():
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_get_user(self):
        user = User(name='John', surname='Doe', email='john@example.com', phone_number='123 Main St', password='password')
        with app.app_context():
            db.session.add(user)
            db.session.commit()

        response = self.app.get('/users/1')
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['name'], 'John')
        self.assertEqual(data['surname'], 'Doe')

    def test_get_users(self):
        user1 = User(name='John', surname='Doe', email='john@example.com', phone_number='123 Main St', password='password')
        user2 = User(name='Jane', surname='Doe', email='jane@example.com', phone_number='456 Oak St', password='password')
        with app.app_context():
            db.session.add_all([user1, user2])
            db.session.commit()

        response = self.app.get('/users')
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data['users']), 2)

    def test_post_user(self):
        data = {
            'name': 'John',
            'surname': 'Doe',
            'email': 'john@example.com',
            'phone_number': '123 Main St',
            'password': 'password'
        }

        response = self.app.post('/users', json=data)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertIn('id', data)

    def test_post_user_wrong_no_surname(self):
        data = {
            'name': 'John',
            'email': 'John@example.com',
            'phone_number': '123 Main St',
            'password': 'password'
        }

        response = self.app.post('/users', json=data)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)

    def test_post_user_wrong_no_email(self):
        data = {
            'name': 'John',
            'phone_number': '123 Main St',
            'password': 'password'
        }

        response = self.app.post('/users', json=data)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)   


    # correct login
    def test_login(self):
        user = User(name='John', surname='Doe', email='john@example.com', phone_number='123 Main St', password='password')
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
        self.assertIn('user', data)

    # wrong login - email
    def test_login_wrong_email(self):
        user = User(name='John', surname='Doe', email='john@example.com', phone_number='123 Main St', password='password')
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
        user = User(name='John', surname='Doe', email='john@example.com', phone_number='123 Main St', password='password')
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

if __name__ == '__main__':
    unittest.main()
