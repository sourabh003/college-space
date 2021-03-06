from flask import jsonify
import app.models.notes as notes_model


def save_notes(data):
    required_fields = {'id', 'name', 'uploaded_by',
                       'uploaded_date', 'course', 'subject', 'download_url'}
    if(data.keys() != required_fields):
        return jsonify(
            success=False,
            message="Parameters Missing",
            data=None
        )
    return notes_model.save_notes(data)


def get_all_notes():
    return notes_model.get_all_notes()


def search_notes(data):
    required_fields = {'course', 'subject'}
    if(data.keys() != required_fields):
        return jsonify(
            success=False,
            message="Parameters Missing",
            data=None
        )
    return notes_model.search_notes(data)


def get_notes_count(data):
    required_fields = {'email'}
    if(data.keys() != required_fields):
        return jsonify(
            success=False,
            message="Parameters Missing",
            data=None
        )
    return notes_model.get_notes_count(data)
