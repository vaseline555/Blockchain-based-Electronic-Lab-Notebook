import time
from jinja2 import evalcontextfilter, environment

from bbs import app


def datetimeformat(value, format='%Y-%m-%d'):
    return time.strftime(format, time.localtime(value))

env=app.jinja_env
env.filters['datetimeformat'] = datetimeformat