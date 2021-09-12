from flask import Flask, render_template, request, jsonify
app = Flask(__name__)
import app.controllers.users as user_controller
import app.controllers.auth as auth_controller

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
    return user_controller.user_login(data)

# API for user signup
@app.route('/api/register',methods = ['POST'])
def registerAPI():
    data = request.get_json()
    return user_controller.user_signup(data)

# API for verifying token
@app.route('/api/verify-token',methods = ['POST'])
def verifyTokenAPI():
    data = request.get_json()
    return auth_controller.verify_token(data)

if __name__ == "__main__":
  app.run(debug=True)