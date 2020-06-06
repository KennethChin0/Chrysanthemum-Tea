# Team Handlebars
# SoftDev1 PD 9
# K25
# 11/13/2019

from flask import Flask, render_template, request, session, redirect, url_for, redirect, json
import sqlite3
import os
from flask import flash
import urllib.request, json
from os import urandom
app = Flask(__name__)
app.secret_key = urandom(32)

#-----------------------------------------------------------------

#DATABASE SETUP
DB_FILE = "Info.db"
db = sqlite3.connect(DB_FILE)
c = db.cursor()
#Creates USER
c.execute(''' SELECT count(name) FROM sqlite_master WHERE type='table' AND name='USER' ''')
if c.fetchone()[0] < 1:
    c.execute("CREATE TABLE USER(username TEXT, password TEXT);")

#retrieves data of all the users
def updateUsers():
    with sqlite3.connect(DB_FILE) as connection:
        cur = connection.cursor()
        foo = cur.execute('SELECT * FROM USER;') # Selects all username/password combinations
        userList = foo.fetchall()
        userList.sort() # Usernames sorted in alphabetical order
        return userList

#revtrieves data of all the users
def updateReviews():
    with sqlite3.connect(DB_FILE) as connection:
        cur = connection.cursor()
        foo = cur.execute('SELECT * FROM REVIEWS;') # Selects all username/password combinations
        reviewList = foo.fetchall()
        return reviewList

#-----------------------------------------------------------------

# DICTIONARY FOR IMPORTANT SEARCH DATA
searchdict = {}

#root route - directs to homepage and creates user session
@app.route("/")
def root():
    return render_template("homepage.html", sessionstatus = "user" in session)


@app.route("/login")
def login():
    # if user already logged in, redirects back to discover
    if 'user' in session:
        return redirect(url_for('root'))
    # checking to see if things were submitted
    if (request.args):
        if (bool(request.args["username"]) and bool(request.args["password"])):
            # setting request.args to variables to make life easier
            inpUser = request.args["username"]
            inpPass = request.args["password"]
            with sqlite3.connect(DB_FILE) as connection:
                cur = connection.cursor()
                q = 'SELECT username, password FROM USER;'
                foo = cur.execute(q)
                userList = foo.fetchall()
                for row in userList:
                    if inpUser == row[0] and inpPass == row[1]:
                        session['user'] = inpUser
                        return(redirect(url_for("root")))
                flash('Username not found or login credentials incorrect.')
                return(redirect(url_for("login")))
        else:
            flash('Login unsuccessful')
            return(redirect(url_for("login")))
    return render_template("login.html")

@app.route("/register")
def register():
  # if user already logged in, redirects back to discover
  if 'user' in session:
    return redirect(url_for('root'))

  # checking to see if things were submitted
  if (request.args):
    if (bool(request.args["username"]) and bool(request.args["password"])):
      # setting request.args to variables to make life easier
      inpUser = request.args["username"]
      inpPass = request.args["password"]
      inpConf = request.args["confirmPass"]

      if(addUser(inpUser, inpPass, inpConf)):
        flash('Success! Please login.')
        with sqlite3.connect(DB_FILE) as connection:
            cur = connection.cursor()
            cur.execute("CREATE TABLE IF NOT EXISTS " +inpUser+ "(month TEXT, date TEXT, expense INTEGER, category TEXT)")
        return redirect(url_for("login"))
      else:
        return(redirect(url_for("register")))
    else:
      flash('Please make sure to fill all fields!')
  return render_template("register.html")

@app.route("/processEntry", methods = ['POST'])
def processEntry():
    user = session['user']
    print(user)
    date = request.form['date']
    print(date)
    expense = request.form['expense']
    print(expense)
    category = request.form['category']
    print(category)
    listOfStuff = date.split('-')
    month = listOfStuff[1]
    print(month)
    with sqlite3.connect(DB_FILE) as connection:
      cur = connection.cursor()
      q = "INSERT INTO " + user + " VALUES('" +month+ "','" +date +"'," +expense+ ",'"+ category+ "');"
      cur.execute(q)
    return redirect(url_for("profile"))

#logout route: removes the user from session and redirects to root
@app.route("/logout")
def logout():
    if "user" in session:
        session.pop('user')
    return redirect(url_for("root"))
#adds user with necessary credentials
def addUser(user, pswd, conf):
  userList = updateUsers()
  for row in userList:
    if user == row[0]:
      flash('Username already taken. Please try again.')
      return False
  if (pswd == conf):
    # SQLite3 is being weird with threading, so I've created a separate object
    with sqlite3.connect(DB_FILE) as connection:
      cur = connection.cursor()
      q = "INSERT INTO USER VALUES('{}', '{}');".format(user, pswd) # Successfully registers new user
      cur.execute(q)
      connection.commit()
    return True
  else:
    flash('Passwords do not match. Please try again.')
    return False

@app.route("/profile")
def profile():
    #checks if user in session
    if "user" not in session:
        return redirect(url_for('root'))
    with sqlite3.connect(DB_FILE) as connection:
        cur = connection.cursor()
        q = "SELECT * FROM " + session['user'] + ";"
        thingy = cur.execute(q)
        data = thingy.fetchall()
        print(data)
    return render_template("profile.html", data = json.dumps(data))




if __name__ == "__main__":
    app.debug = True
    app.run()
