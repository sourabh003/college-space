from flask.json import jsonify
from app.models.connection import connect_to_database
import app.models.users as users_model


def save_notes(notes):
    mydb = connect_to_database()
    mycursor = mydb.cursor()

    sql = "INSERT INTO notes (id, uploaded_by, uploaded_date, course, subject, download_url) VALUES (%s, %s, %s, %s, %s, %s)"
    val = (notes['id'], notes['uploaded_by'],
           notes['uploaded_date'], notes['course'], notes['subject'], notes['download_url'])
    mycursor.execute(sql, val)
    mydb.commit()

    if(mycursor.rowcount < 1):
        return jsonify(
            success=False,
            message="Saving notes Failed",
            data=None
        )

    user = users_model.get_user({"email": notes['uploaded_by']})
    notesDetails = {
        "id": notes['id'],
        "uploaded_by": {
            "name": user['name'],
            "email": user['email']
        },
        "uploaded_date": notes['uploaded_date'],
        "course": notes['course'],
        "subject": notes['subject'],
        "download_url": notes['download_url']
    }
    return jsonify(
        success=True,
        message="Notes Saved Succesfully",
        data={
            "notes": notesDetails
        }
    )
