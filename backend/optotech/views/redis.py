from rest_framework.views import APIView
from rest_framework.response import Response
import redis
from ..utils.custom_exception_handler import CustomAPIException
import jwt
from datetime import datetime, timedelta
import os

class RedisView(APIView):
    def __init__(self):
        self.r = redis.Redis(host='redis', port=6379, decode_responses=True)
        self.secret_key = os.environ.get("PRIVATE_KEY")

    def is_token_in_blacklist(self, payload):        
        blacklist = self.r.keys("*")
        return payload["user_id"] in blacklist if "user_id" in payload else False
    
    def insert_token_to_blackist(self, token):
        payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])        
        
        self.r.setex(payload["user_id"], 1*60*60, token)

        blacklist = self.r.keys("*")

        return payload["user_id"] in blacklist

    def get(self, request):                    
        token = request.COOKIES.get("token", None)
        payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
        
        blacklist = self.r.keys("*")      
        if payload["user_id"] in blacklist:
            raise CustomAPIException("No validated token", 403)                
        
        self.r.setex(payload["user_id"], 1*60*60, token)

        return Response(payload["user_id"])
    
    def post(self, request):
        # Define o payload do JWT
        payload = {
            "sub": "1233123123",
            "exp": datetime.utcnow() + timedelta(hours=1),
            "id":"id"
        }

        # Cria o JWT com o payload e a chave secreta
        jwt_token = jwt.encode(payload, self.secret_key, algorithm="HS256")

        # Imprime o JWT gerado
        return Response({"token":jwt_token})
    