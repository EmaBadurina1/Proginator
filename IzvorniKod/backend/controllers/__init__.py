from posixpath import abspath, dirname

import sys
sys.path.append(abspath(dirname(__file__)))

from .auth_controllers import auth_bp
from .accounts_controllers import accounts_bp
from .appointments_controllers import appointments_bp
from .rooms_controller import rooms_bp
from .devices_controller import devices_bp
from .therapies_controller import therapies_bp
from .crud_template import get_all, get_one, create, update, delete