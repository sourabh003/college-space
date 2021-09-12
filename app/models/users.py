from flask.json import jsonify
from app.models.connection import connect_to_database
from app.utils.functions import uniqueID
import datetime
import jwt
import json

config = ""
with open("configs/config.json") as config_file:
    config = json.load(config_file)

def create_user(user):
    mydb = connect_to_database()
    mycursor = mydb.cursor()

    id = uniqueID()
    created_date = datetime.datetime.now().timestamp()

    sql = "INSERT INTO users (id, name, email, password, created_date) VALUES (%s, %s, %s, %s, %s)"
    val = (id, user['name'], user['email'], user['password'], created_date)
    mycursor.execute(sql, val)
    mydb.commit()

    if(mycursor.rowcount < 1):
        return jsonify(
            success=False,
            message="User Sign up Failed",
            data=None
        )
    userData = {
        "id":id,
        "name":user['name'],
        "email":user['email'],
    }
    token = jwt.encode(userData, config['jwt_secret'], algorithm="HS256")
    return jsonify(
        success=True,
        message="User Sign up Success",
        data={
            "token": token
        }
    )

def login_user(user):
    mydb = connect_to_database()
    mycursor = mydb.cursor()

    sql = f"SELECT * FROM users WHERE email ='{user['email']}'"
    mycursor.execute(sql)
    result = mycursor.fetchall()
    if len(result) == 0:
        return jsonify(
            error=True,
            data=None,
            message="User doesn't exists"
        )
    else:
        if(user['password'] == result[0][3]):
            userData = {
                "id":result[0][0],
                "name":result[0][1],
                "email":result[0][2],
            }
            token = jwt.encode(userData, config['jwt_secret'], algorithm="HS256")
            return jsonify(
                    error=False,
                    data={"token":token},
                    message="Login Success"
                )
        else: 
            return jsonify(
                error=True,
                data=None,
                message="invalid Password"
            )