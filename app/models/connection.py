import mysql.connector
import json

config = ""
with open("configs/db.json") as config_file:
    config = json.load(config_file)

def connect_to_database():
    mydb = mysql.connector.connect(
        host=config['host'],
        user=config['user'],
        password=config['password'],
        database=config['database'],
    )
    return mydb

