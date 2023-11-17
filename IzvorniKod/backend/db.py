# database
from flask_sqlalchemy import SQLAlchemy
print(globals())

if not hasattr(globals(), 'db'):
    print("napravio novi db---------------")
    db = SQLAlchemy()