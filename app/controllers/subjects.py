from flask import jsonify
import app.models.subjects as subjects_model


def addNewSubject(data):
    required_fields = {'name', 'course'}
    if(data.keys() != required_fields):
        return jsonify(
            success=False,
            message="Parameters Missing",
            data=None
        )
    return subjects_model.addNewSubject(data)


def getAllSubjects():
    return subjects_model.getAllSubjects()


def getSubjectByCourseID(data):
    required_fields = {'id'}
    if(data.keys() != required_fields):
        return jsonify(
            success=False,
            message="Parameters Missing",
            data=None
        )
    return subjects_model.getSubjectByCourseID(data)
