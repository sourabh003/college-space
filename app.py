import app.controllers.post as posts_controller
import app.controllers.auth as auth_controller
import app.controllers.users as user_controller
from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

# ===================== Route for pages ==================== #


@app.route("/")
def home():
    return render_template('index.html')


@app.route("/login")
def loginPage():
    return render_template('login.html')


@app.route("/register")
def registerPage():
    return render_template('register.html')


@app.route("/notes")
def notesPage():
    return render_template('notes.html')

# ===================== APIs for User Login ==================== #


@app.route('/api/login', methods=['POST'])
def loginAPI():
    data = request.get_json()
    return user_controller.user_login(data)

# ===================== API for User Signup ==================== #


@app.route('/api/register', methods=['POST'])
def registerAPI():
    data = request.get_json()
    return user_controller.user_signup(data)

# ===================== API for Verify Token ==================== #


@app.route('/api/verify-token', methods=['POST'])
def verifyTokenAPI():
    data = request.get_json()
    return auth_controller.verify_token(data)

# ===================== API for Create Post ==================== #


@app.route('/api/post/create', methods=['POST'])
def createPostAPI():
    data = request.get_json()
    return posts_controller.create_post(data)

# ===================== API for Fetch Posts ==================== #


@app.route('/api/post/get_all', methods=['GET'])
def getPostsAPI():
    return posts_controller.get_posts()

# ===================== API for Fetch Post Count ==================== #


@app.route('/api/post/count', methods=['POST'])
def getPostCount():
    data = request.get_json()
    return posts_controller.get_post_count(data)

# ===================== API for Delete all posts ==================== #


@app.route('/api/post/delete', methods=['POST'])
def deletePost():
    data = request.get_json()
    return posts_controller.delete_post(data)


if __name__ == "__main__":
    app.run(debug=True)
