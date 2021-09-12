from app.models.connection import connect_to_database
from app.utils.functions import uniqueID
import datetime

def create_user(user):
    mydb = connect_to_database()
    mycursor = mydb.cursor()

    id = uniqueID()
    created_date = datetime.datetime.now().timestamp()

    sql = "INSERT INTO users (id, name, email, password, created_date) VALUES (%s, %s, %s, %s, %s)"
    val = (id, user['name'], user['email'], user['password'], created_date)
    mycursor.execute(sql, val)
    mydb.commit()

    print(mycursor.rowcount, "record inserted.")
    return mycursor.rowcount