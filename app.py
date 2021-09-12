from flask import Flask, render_template, request, jsonify
app = Flask(__name__)
from app.controllers.users import user_login, user_signup

# Default Route for index page
@app.route("/")
def hello():
    return render_template('login.html')

# Route for user login 
@app.route('/login',methods = ['POST'])
def login():
    data = request.get_json()
    return user_login(data)

# Route for user signup
@app.route('/register',methods = ['POST'])
def register():
    data = request.get_json()
    return user_signup(data)


if __name__ == "__main__":
  app.run(debug=True)