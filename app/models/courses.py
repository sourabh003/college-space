from flask.json import jsonify
from app.models.connection import connect_to_database


def getCourseByID(id):
    mydb = connect_to_database()
    mycursor = mydb.cursor()

    sql = f"SELECT * FROM courses where id='{id}'"
    mycursor.execute(sql)
    results = mycursor.fetchall()
    course = {
        "id": results[0][0],
        "name": results[0][1],
    }
    return {
        "error": False,
        "data": {"course": course},
        "message": "Fetch Course By ID Success"
    }


def getAllCourses():
    mydb = connect_to_database()
    mycursor = mydb.cursor()

    sql = f"SELECT * FROM courses"
    mycursor.execute(sql)
    results = mycursor.fetchall()
    courses = []
    for course in results:
        courses.append({
            "id": course[0],
            "name": course[1],
        })
    return jsonify(
        error=False,
        data={"courses": courses},
        message="Fetch Courses Success"
    )
