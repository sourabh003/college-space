from flask import jsonify
import app.models.notes as notes_model


def save_notes(data):
    required_fields = {'id', 'uploaded_by',
                       'uploaded_date', 'course', 'subject', 'download_url'}
    if(data.keys() != required_fields):
        return jsonify(
            success=False,
            message="Parameters Missing",
            data=None
        )
    return notes_model.save_notes(data)
