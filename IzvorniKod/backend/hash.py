import bcrypt

if __name__ == "__main__":
   salt = bcrypt.gensalt()
   password = 'progi1234'
   hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
   print(hashed_password.decode('utf-8'))