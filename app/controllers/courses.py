from flask import jsonify
import app.models.courses as courses_model


def getCourseByID(id):
    return courses_model.getCourseByID(id)


def getAllCourses():
    return courses_model.getAllCourses()
