from flask import jsonify
import app.models.subjects as subjects_model


def getAllSubjects():
    return subjects_model.getAllSubjects()
