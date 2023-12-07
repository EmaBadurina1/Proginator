from posixpath import abspath, dirname

import sys
sys.path.append(abspath(dirname(__file__)))

from .accounts_controllers import accounts_bp
from .appointments_controllers import appointments_bp