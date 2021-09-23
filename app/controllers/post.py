from flask import jsonify
import app.models.post as posts_model


def create_post(data):
    required_fields = {'created_by', 'data'}
    if(data.keys() != required_fields):
        return jsonify(
            success=False,
            message="Parameters Missing",
            data=None
        )
    return posts_model.create_post(data)


def get_posts():
    return posts_model.get_posts()
