import os

CSRF_ENABLED = False

basedir = os.path.abspath(os.path.dirname(__file__))

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'bbs.db')
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')


# configuration
DATABASE = os.path.join(basedir, 'bbs.db')
DEBUG = True
SECRET_KEY = 'developmentkkkkey'