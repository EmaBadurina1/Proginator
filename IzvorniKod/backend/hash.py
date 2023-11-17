from werkzeug.security import generate_password_hash, check_password_hash

if __name__ == "__main__":
   password = 'progi1234'
   hash = generate_password_hash(password)
   print(hash)

   print(check_password_hash(hash, password))