# Team Handlebars
# SoftDev1 PD 9
# K25
# 11/13/2019

from flask import Flask, render_template, request, session, redirect, url_for, redirect
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
        return redirect(url_for("login"))
      else:
        return(redirect(url_for("register")))
    else:
      flash('Please make sure to fill all fields!')
  return render_template("register.html")

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

#inserts a selected bike of the current user
@app.route("/addBike")
def addBike():
    with sqlite3.connect(DB_FILE) as connection:
        c = connection.cursor()
        c.execute("INSERT INTO SAVEDBIKES VALUES ('{}', '{}')".format(session['user'],2)) #Adds the bike of the logged in user
        connection.commit()
    return redirect(url_for("profile"))


# Dispalys user's personal blog page and loads HTML with blog writing form
@app.route("/profile")
def profile():
    #checks if user in session
    if "user" not in session:
        return redirect(url_for('root'))
    if (len(request.args) == 1):
        with sqlite3.connect(DB_FILE) as connection:
            c = connection.cursor()
            if ("id" in request.args.keys()):
                c.execute("SELECT * FROM SAVEDBIKES WHERE username = (?) AND bikeNumber = (?)", (session["user"], request.args["id"]))
                if (len(c.fetchall()) == 0):
                    c.execute("INSERT INTO SAVEDBIKES VALUES (?, ?)", (session["user"], request.args["id"]))
            if ("rid" in request.args.keys()):
                c.execute("DELETE FROM SAVEDBIKES WHERE username = (?) AND bikeNumber = (?)", (session["user"], request.args["rid"]))
            if ("dr" in request.args.keys()):
                c.execute("DELETE FROM REVIEWS WHERE username = (?) AND bikeNumber = (?)", (session["user"], request.args["dr"]))
            connection.commit()
    entryList = updateSavedBikes()
    userList = updateUsers()
    reviewList = updateReviews()
    # userSaved is filtered list of all entries by specific user
    userSaved = []
    toprint = []
    reviews = []
    reviewLocales = {}
    # goes through Saved bikes and if it is the users it appends it
    for entry in entryList:
        if entry[0] == session['user']:
            userSaved.append(entry)
    for entry in userSaved:
        cityName = ""
        with sqlite3.connect(DB_FILE) as connection:
          cur = connection.cursor()
          q = "SELECT * FROM BIKES"
          foo = cur.execute(q)
          bikeList = foo.fetchall()
          for x in bikeList:
              if x[0] == entry[1]:
                  toprint.append(x)
                  break
    for entry in reviewList:
        if entry[0] == session["user"]:
            reviews.append(entry)

    reviews.reverse()
    with sqlite3.connect(DB_FILE) as connection:
        cur = connection.cursor()
        q = "SELECT * FROM BIKES"
        foo = cur.execute(q)
        rL = foo.fetchall()
        for x in rL:
          for y in reviews:
              if x[0] == y[1]:
                  reviewLocales[y[1]] = (x[2], x[3])
    return render_template("profile.html",
    title = "Profile - {}".format(session["user"]), heading = session["user"],
    entries = userSaved, toprint = toprint, reviews = reviews, locs = reviewLocales, sessionstatus = "user" in session)



if __name__ == "__main__":
    app.debug = True
    app.run()
