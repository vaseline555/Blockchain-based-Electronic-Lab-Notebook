import sqlite3
from flask import Flask, g
from contextlib import closing

from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config')
app.config.setdefault('SQLALCHEMY_TRACK_MODIFICATIONS', True)
app.jinja_env.add_extension('jinja2.ext.loopcontrols')

db = SQLAlchemy(app)

def connect_db():
     return sqlite3.connect(app.config['DATABASE'])

def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
    db.commit()

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()
    g.db.close()

lm = LoginManager()
lm.init_app(app)
lm.login_view = 'login'

from bbs import views, userAction, postAction, filters