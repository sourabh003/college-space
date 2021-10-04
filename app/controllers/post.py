from flask import jsonify
import app.models.post as posts_model


def create_post(data):
    required_fields = {'created_by', 'data', 'created_date'}
    if(data.keys() != required_fields):
        return jsonify(
            success=False,
            message="Parameters Missing",
            data=None
        )
    return posts_model.create_post(data)


def get_posts():
    return posts_model.get_posts()


def get_post_count(data):
    required_fields = {'email'}
    if(data.keys() != required_fields):
        return jsonify(
            success=False,
            message="Parameters Missing",
            data=None
        )
    return posts_model.get_post_count(data)


def delete_post(data):
    required_fields = {'id'}
    if(data.keys() != required_fields):
        return jsonify(
            success=False,
            message="Parameters Missing",
            data=None
        )
    return posts_model.delete_post(data)
