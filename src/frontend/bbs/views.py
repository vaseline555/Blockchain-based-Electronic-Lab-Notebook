from flask_login import current_user
from flask_bootstrap import Bootstrap
from bbs import app, models
from flask import render_template, flash, redirect, session, url_for, request, g

bootstrap = Bootstrap(app)

@app.route('/')
@app.route('/index')
def index():
    posts = models.Post.query.order_by(models.Post.id.desc()).all()
    newPosts = []
    for p in posts:
        user = models.User.query.get(p.user_id)
        reply_count = models.Reply.query.filter_by(post_id=p.id)
        if str(reply_count)[-1] == '?':
            reply_count = 0
        else:
            reply_count = reply_count.count()
        newPosts.append({'post': p, 'user': user, 'reply_count': reply_count})
    return render_template("index.html", posts=newPosts)


@app.route('/login')
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    return render_template("login.html")


@app.route('/reg')
def reg():
    return render_template("register.html")


@app.route('/post', methods=['GET'])
def post():
    if current_user.is_authenticated is False:
        flash('Please sign in first!')
        return redirect(url_for('login'))
    return render_template("post.html")


@app.route('/userposts', methods=['GET'])
def user_posts():
    if current_user.is_authenticated is False:
        flash('Please sign in first!')
        return redirect(url_for('login'))

    user_id = request.args.get('user_id')
    posts = models.Post.query.filter_by(user_id=user_id).all()
    user = models.User.query.get(user_id)
    return render_template("my-posts.html", posts=posts, user=user)