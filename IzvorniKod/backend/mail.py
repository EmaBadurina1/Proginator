from flask_mail import Mail

if not hasattr(globals(), 'mail'):
   mail = Mail()