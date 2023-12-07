# database
from flask_sqlalchemy import SQLAlchemy

if not hasattr(globals(), 'db'):
    db = SQLAlchemy()