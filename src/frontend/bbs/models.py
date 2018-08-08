import json

from bbs import db, lm


class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    nickname = db.Column(db.String(64), index = True, unique = True)
    email = db.Column(db.String(120), index = True, unique = True)
    password = db.Column(db.String(120))
    timestamp = db.Column(db.Integer)
    role = db.Column(db.Text)
    posts = db.relationship('Post', backref='author', lazy='dynamic')

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)  # python 3

    def is_allowed(self):
        if ("Professor" in str(self.role)) or ("Senior" in str(self.role)):
            return True
        else:
            return False

    @lm.user_loader
    def load_user(id):
        return User.query.get(int(id))

    def __repr__(self):
        return json.dumps({'id':self.id, 'nickname':self.nickname, 'email':self.email, 'role':self.role})


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(140))
    body = db.Column(db.String(256))
    timestamp = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    replys = db.relationship('Reply', backref='author', lazy='dynamic')

    def __repr__(self):
        return '<Post %r>' % (self.title)


class Reply(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(140))
    timestamp = db.Column(db.Integer)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Reply %r>' % (self.title)