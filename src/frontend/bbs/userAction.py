import hashlib
import time
from flask_login import login_user, logout_user, current_user
from bbs import app, models, db
from flask import render_template, flash, redirect, session, url_for, request, g
import requests



@app.route('/register', methods=['POST'])
def register():
    pwd = md5_encode(request.form['password'])
    id = request.form['id']
    email = request.form['email']
    role = request.form['role']
    fN = request.form['firstName']
    lN = request.form['lastName']
    org = request.form['org']

    # commit to SQL database
    user = models.User(nickname=id, email=email, role=role, password=pwd, timestamp=time.time())
    db.session.add(user)
    db.session.commit()

    # researcher
    if ("Student" in role) or ("Researcher" in role):
        api_url = "http://114.70.14.56:10041/api/labnotebook.blockchain"
        input = {
            "$class": "labnotebook.blockchain.researcher",
            "ResearcherID": id,
            "name": {
                "$class": "labnotebook.blockchain.Name",
                "firstName": fN,
                "lastName": lN
            },
            "Organization": org,
            "Position": role
        }
        response = requests.post(api_url + ".researcher", json=input)
        if response.status_code == 200:
            api_url = "http://114.70.14.56:10041/api/labnotebook.blockchain"
            r = requests.delete(api_url + ".head/" + id)
        else:
            print(response.text)
            flash("Something went wrong :(")

    # head
    if ("Professor" in role) or ("Senior" in role):
        api_url = "http://114.70.14.56:10041/api/labnotebook.blockchain"
        input = {
            "$class": "labnotebook.blockchain.head",
            "ResearcherID": id,
            "name": {
                "$class": "labnotebook.blockchain.Name",
                "firstName": fN,
                "lastName": lN
            },
            "Organization": org,
            "Position": role
        }
        response = requests.post(api_url + ".head", json=input)
        if response.status_code == 200:
            api_url = "http://114.70.14.56:10041/api/labnotebook.blockchain"
            r = requests.delete(api_url + ".researcher/" + id)
        else:
            print(response.text)
            flash("Something went wrong :(")


    flash('Signed up successfully!')

    return redirect(url_for('login'))


@app.route('/sign', methods=['POST'])
def sign():
    form_email = request.form['email']
    form_pwd = md5_encode(request.form['password'])
    user = models.User.query.filter_by(email=form_email).filter_by(password=form_pwd).first()
    if user is None:
        error = 'Wrong E-mail address or Password'
        return render_template('login.html', error=error)

    login_user(user)
    flash('Welcome {}!'.format(current_user.nickname))
    return redirect(url_for('index'))


@app.route('/logout', methods=['GET'])
def logout():
    logout_user()
    session.clear()
    return redirect(url_for('login'))


def md5_encode(str):
    # The argument must be of type byte, otherwise Unicode-objects must be encoded before hashing
    m = hashlib.md5(str.encode(encoding='utf-8'))
    return m.hexdigest()