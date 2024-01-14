import re
import os
from itsdangerous import URLSafeTimedSerializer
from dotenv import load_dotenv
import random
import string

load_dotenv()

# check if there are missing fields
def validate_required_fields(data, required_fields):
    missing_fields = [field for field in required_fields if field not in data]
    return missing_fields

# check if required_fields are empty
def validate_empty_fields(data, required_fields):
    empty_fields = [field for field in required_fields if data[field] == ""]
    return empty_fields

# check if OIB or MBO is in right format
def validate_number(number, length):
    pattern = re.compile(r'^\d{' + str(length) + '}$')
    return bool(pattern.match(number))

# generate token for email verification
def generate_token(email):
    serializer = URLSafeTimedSerializer(os.getenv("SECRET_KEY"))
    return serializer.dumps(email, salt=os.getenv("EMAIL_SALT"))

# confirm token for email verification
def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(os.getenv("SECRET_KEY"))
    try:
        email = serializer.loads(
            token, salt=os.getenv("EMAIL_SALT"), max_age=expiration
        )
        return email
    except Exception:
        return False

def generate_password(length=8):
    characters = string.ascii_lowercase  # Using lowercase letters
    password = ''.join(random.choice(characters) for i in range(length))
    return password