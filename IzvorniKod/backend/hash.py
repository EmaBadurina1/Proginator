import bcrypt

if __name__ == "__main__":
   salt = b"$2b$12$ZCOqpHV4LynVhCNuhxIryu"
   print(salt)
   password = 'progi1234'
   hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
   print(hashed_password.decode('utf-8'))
   print(bcrypt.checkpw(password.encode('utf-8'), hashed_password))