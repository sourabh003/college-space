from flask import jsonify
import json
import jwt

config = ""
with open("configs/config.json") as config_file:
    config = json.load(config_file)

def verify_token(data):
    required_fields = {'token'}
    if(data.keys() != required_fields):
        return jsonify(
            success=False,
            message="Parameters Missing",
            data=None
        )

    try:
        token = jwt.decode(data['token'], config['jwt_secret'], algorithms=["HS256"])
        return jsonify(
            success=True,
            message="Token Verified",
            data=token
        )
    except Exception as e:
        return jsonify(
            success=False,
            message="Token Verification Failed",
            data={
                "error": e
            }
        )
    
