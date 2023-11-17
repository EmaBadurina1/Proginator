
import pytest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask.wrappers import Response

from ..app import app
from ..database import db

@pytest.fixture
def client():
    return app.test_client()

def test_get_users(client):
    response: Response = client.get('/users/')

    print(response.headers)
    assert response.status_code == 200
    assert response.json == []