import os

SECRET_KEY = 'secret_key'
TOKEN_EXPIRATION_TIME = 60 * 60 * 24  # 1 day
DATABASE_URI = f'sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'database.db')