from flask.json import jsonify
from app.models.connection import connect_to_database
import app.models.courses as courses_model


def getAllSubjects():
    mydb = connect_to_database()
    mycursor = mydb.cursor()

    sql = f"SELECT * FROM subjects"
    mycursor.execute(sql)
    results = mycursor.fetchall()
    subjects = []
    for subject in results:
        courseResponse = courses_model.getCourseByID(subject[2])
        subjects.append({
            "id": subject[0],
            "name": subject[1],
            "course": courseResponse['data']['course'],
        })
    return jsonify(
        error=False,
        data={"subjects": subjects},
        message="Fetch Subjects Success"
    )


def getSubjectByCourseID(data):
    mydb = connect_to_database()
    mycursor = mydb.cursor()

    sql = f"SELECT * FROM subjects where course={data['id']}"
    mycursor.execute(sql)
    results = mycursor.fetchall()
    subjects = []
    for subject in results:
        courseResponse = courses_model.getCourseByID(subject[2])
        subjects.append({
            "id": subject[0],
            "name": subject[1],
            "course": courseResponse['data']['course'],
        })
    return jsonify(
        error=False,
        data={"subjects": subjects},
        message="Fetch Subjects Success"
    )


def getSubjectByID(id):
    mydb = connect_to_database()
    mycursor = mydb.cursor()

    sql = f"SELECT * FROM subjects where id='{id}'"
    mycursor.execute(sql)
    results = mycursor.fetchall()
    subject = {
        "id": results[0][0],
        "name": results[0][1],
    }
    return {
        "error": False,
        "data": {"subject": subject},
        "message": "Fetch Subject By ID Success"
    }
