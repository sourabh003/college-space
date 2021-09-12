from flask import jsonify
import app.models.users as users_model

def user_signup(data):
    required_fields = {'name', 'email', 'password'}
    if(data.keys() != required_fields):
        return jsonify(
            success=False,
            message="Parameters Missing",
            data=None
        )
    return users_model.create_user(data)

def user_login(data):
    required_fields = {'email', 'password'}
    if(data.keys() != required_fields):
        return jsonify(
            success=False,
            message="Parameters Missing",
            data=None
        )
    return users_model.login_user(data)