from flask import jsonify
import app.models.users as users_model

def user_login(data):
    required_fields = {'email', 'password'}
    if(data.keys() != required_fields):
        return jsonify(
            success=False,
            message="Parameters Missing",
            data=None
        )
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

def user_signup(data):
    required_fields = {'name', 'email', 'password'}
    if(data.keys() != required_fields):
        return jsonify(
            success=False,
            message="Parameters Missing",
            data=None
        )
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