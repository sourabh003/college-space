from flask.json import jsonify
from app.models.connection import connect_to_database
from app.utils.functions import uniqueID
import datetime
import app.models.users as users_model


def create_post(post):
    mydb = connect_to_database()
    mycursor = mydb.cursor()

    id = uniqueID()

    sql = "INSERT INTO posts (id, created_by, created_date, data) VALUES (%s, %s, %s, %s)"
    val = (id, post['created_by'], post['created_date'], post['data'])
    mycursor.execute(sql, val)
    mydb.commit()

    if(mycursor.rowcount < 1):
        return jsonify(
            success=False,
            message="Create post Failed",
            data=None
        )

    user = users_model.get_user({"email": post['created_by']})
    postDetails = {
        "id": id,
        "created_by": {
            "name": user['name'],
            "email": user['email']
        },
        "created_date": post['created_date'],
        "data": post['data']
    }
    return jsonify(
        success=True,
        message="Post Create Success",
        data={
            "post": postDetails
        }
    )


def get_posts():
    mydb = connect_to_database()
    mycursor = mydb.cursor()

    sql = f"SELECT * FROM posts"
    mycursor.execute(sql)
    results = mycursor.fetchall()
    posts = []
    for post in results:
        user = users_model.get_user({"email": post[1]})
        posts.append({
            "id": post[0],
            "created_by": {
                "email": post[1],
                "name": user['name']
            },
            "created_date": post[2],
            "data": post[3],
        })
    return jsonify(
        error=False,
        data={"posts": posts},
        message="Fetch Posts Success"
    )


def get_post_count(data):
    mydb = connect_to_database()
    mycursor = mydb.cursor()
    sql = f"SELECT COUNT(created_by) FROM posts WHERE created_by='{data['email']}';"
    mycursor.execute(sql)
    results = mycursor.fetchall()
    return jsonify(
        error=False,
        data={"count": results[0][0]},
        message="Fetch Post Count Success"
    )


def delete_post(data):
    mydb = connect_to_database()
    mycursor = mydb.cursor()
    sql = f"delete from posts where id='{data['id']}';"
    mycursor.execute(sql)
    mydb.commit()
    print(mycursor)
    return jsonify(
        error=False,
        data=None,
        message="Post Deleted"
    )
