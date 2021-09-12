from flask import jsonify
import app.models.users as users_model

def user_login(data):
    return jsonify(
        success=True,
        message="Hello world",
        data=data
    )

def user_signup(data):
    rowCount = users_model.create_user(data)
    if(rowCount < 1):
        return jsonify(
            success=False,
            message="User Sign up Failed",
            data=None
        )
    return jsonify(
        success=True,
        message="User Registered",
        data=data
    )