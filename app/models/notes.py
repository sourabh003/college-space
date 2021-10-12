from flask.json import jsonify
from app.models.connection import connect_to_database
import app.models.users as users_model
import app.models.courses as courses_model
import app.models.subjects as subjects_model


def save_notes(notes):
    mydb = connect_to_database()
    mycursor = mydb.cursor()

    sql = "INSERT INTO notes (id, name, uploaded_by, uploaded_date, course, subject, download_url) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    val = (notes['id'], notes['name'], notes['uploaded_by'],
           notes['uploaded_date'], notes['course'], notes['subject'], notes['download_url'])
    mycursor.execute(sql, val)
    mydb.commit()

    if(mycursor.rowcount < 1):
        return jsonify(
            success=False,
            message="Saving notes Failed",
            data=None
        )

    return jsonify(
        success=True,
        message="Notes Saved Succesfully",
        data=None
    )


def get_all_notes():
    mydb = connect_to_database()
    mycursor = mydb.cursor()

    sql = f"SELECT * FROM notes"
    mycursor.execute(sql)
    results = mycursor.fetchall()
    notes = []
    for note in results:
        print(note)
        user = users_model.get_user({"email": note[1]})
        course = courses_model.getCourseByID(note[3])['data']['course']
        subject = subjects_model.getSubjectByID(note[4])['data']['subject']
        print(subject)
        notes.append({
            "id": note[0],
            "uploaded_by": {
                "email": note[1],
                "name": user['name']
            },
            "uploaded_date": note[2],
            "course": {
                "id": course['id'],
                "name": course['name']
            },
            "subject": {
                "id": subject['id'],
                "name": subject['name']
            },
            "download_url": note[5],
            "name": note[6]
        })
    return jsonify(
        error=False,
        data={"notes": notes},
        message="Fetch Notes Success"
    )
