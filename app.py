from flask import Flask, render_template, request, jsonify
app = Flask(__name__)
from app.controllers.users import user_login, user_signup

# Default Route for index page
@app.route("/")
def home():
    return render_template('index.html')

@app.route("/login")
def loginPage():
    return render_template('login.html')

@app.route("/register")
def registerPage():
    return render_template('register.html')

# API for user login 
@app.route('/api/login',methods = ['POST'])
def loginAPI():
    data = request.get_json()
    return user_login(data)

# API for user signup
@app.route('/api/register',methods = ['POST'])
def registerAPI():
    data = request.get_json()
    return user_signup(data)


if __name__ == "__main__":
  app.run(debug=True)