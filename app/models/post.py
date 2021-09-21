from flask.json import jsonify
from app.models.connection import connect_to_database
from app.utils.functions import uniqueID
import datetime
import app.models.users as users_model

def create_post(post):
    mydb = connect_to_database()
    mycursor = mydb.cursor()

    id = uniqueID()
    created_date = datetime.datetime.now().timestamp()

    sql = "INSERT INTO posts (id, created_by, created_date, data) VALUES (%s, %s, %s, %s)"
    val = (id, post['created_by'], created_date, post['data'])
    mycursor.execute(sql, val)
    mydb.commit()

    if(mycursor.rowcount < 1):
        return jsonify(
            success=False,
            message="Create post Failed",
            data=None
        )
        
        
    user = users_model.get_user({"email": post['created_by']})
    time = datetime.datetime.fromtimestamp(created_date)
    postDetails = {
        "id":id,
        "created_by":user['name'],
        "created_date":{
                "date": time.strftime('%d %B %Y'),
                "time" : time.strftime('%H:%M %p')
            },
        "data":post['data']
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
        time = datetime.datetime.fromtimestamp(float(post[2]))
        user = users_model.get_user({"email": post[1]})
        print(f'Response User Info : {user}')
        posts.append({
            "id":post[0],
            "created_by":user['name'],
            "created_date":{
                "date": time.strftime('%d %B %Y'),
                "time" : time.strftime('%H:%M %p')
            },
            "data":post[3],
        })
    return jsonify(
            error=False,
            data={"posts":posts},
            message="Fetch Posts Success"
        )
   