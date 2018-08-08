import time
import requests
import hashlib
from flask_login import current_user

from bbs import app, models, db
from flask import render_template, flash, redirect, session, url_for, request, g

import re
TAG_RE = re.compile(r'<[^>]+>')

def remove_tags(text):
    return TAG_RE.sub('', text)

def md5_encode(str):
    # The argument must be of type byte, otherwise Unicode-objects must be encoded before hashing
    m = hashlib.md5(str.encode(encoding='utf-8'))
    return m.hexdigest()

@app.route('/post/save', methods=['POST'])
def save_post():
    post = models.Post(title=request.form['title'], body=request.form['content'], user_id=current_user.id, timestamp=time.time())
    user_query = models.User.query.get(current_user.id)
    id = str(user_query.nickname)
    content = request.form['content']

    img_addr = None
    if content.find('img src=\"') is not -1:
        start = content.find('img src=') + 9
        end = content.find('jpg') + 3
        img_addr = content[start:end]
        img_addr = md5_encode(img_addr)

    eq = None
    if content.find("\\") is not -1:
        start = content.find("\\")
        end = content.find('</span>')
        eq = content[start:end]
        eq = md5_encode(eq)

    api_url = "http://114.70.14.56:10041/api/labnotebook.blockchain"

    input = {
        "$class": "labnotebook.blockchain.writePage",
        "writtenDate": time.time(),
        "contents": {
            "$class": "labnotebook.blockchain.PageContents",
            "text": [remove_tags(request.form['title']), remove_tags(request.form['content'])],
            "image": [img_addr],
            "equation": [eq],
        },
        "Project": "resource:labnotebook.blockchain.LabNotebook#BELN001",
        "Writer": ["resource:labnotebook.blockchain.researcher#" + id],
        "Advisor": ["resource:labnotebook.blockchain.researcher#H001"],
    }

    response = requests.post(api_url + ".writePage", json=input)
    if response.status_code == 200:
        flash('Successfully posted!')
    else:
        print(response.text)
        flash("Something went wrong :(")

    db.session.add(post)
    db.session.commit()

    return redirect(url_for('index'))


@app.route('/detail', methods=['GET'])
def post_detail():
    post_id = request.args.get('post_id')
    post = models.Post.query.get(post_id)
    user = models.User.query.get(post.user_id)
    replys = models.Reply.query.filter_by(post_id=post_id)
    newReplys = []
    for r in replys.all():
        newReplys.append({'reply': r, 'user': models.User.query.get(r.user_id)})

    return render_template("detail.html", post=post, user=user, replys=newReplys)


@app.route('/modify', methods=['GET'])
def modify():
    """Things to be implemented"""
    return redirect(url_for('modify'))


@app.route('/reply', methods=['POST'])
def reply():
    user_query = models.User.query.get(current_user.id)
    id = str(user_query.nickname)

    api_url = "http://114.70.14.56:10041/api/labnotebook.blockchain"
    input = {
        "$class": "labnotebook.blockchain.verifier_verifyBLN",
        "Verifier": ["resource:labnotebook.blockchain.head#" + id],
          "pageToBeVerified": "resource:labnotebook.blockchain.NotebookPage#BELN001_" + str(int(request.form['post_id']) - 5),
          "verifiedDate": time.time(),
          "verificationResult": False,
          "comments": request.form['content']
    }
    response = requests.post(api_url + ".verifier_verifyBLN", json=input)
    if response.status_code == 200:
        flash('Successfully posted!')
    else:
        print(response.text)
        flash("Something went wrong :(")

    # SQL DB commit
    reply = models.Reply(content=request.form['content'], post_id=request.form['post_id'],
                         user_id=current_user.id, timestamp=time.time())
    db.session.add(reply)
    db.session.commit()
    flash('Successfully posted!')
    return redirect(url_for('post_detail', post_id=request.form['post_id']))

@app.route('/delete', methods=['GET'])
def delete():
    post_id = request.args.get('post_id')
    post = models.Post.query.get(post_id)
    replys = models.Reply.query.filter_by(post_id=post_id).all()
    for reply in replys:
        db.session.delete(reply)
    db.session.delete(post)
    db.session.commit()
    return redirect(url_for('user_posts', user_id=current_user.id))