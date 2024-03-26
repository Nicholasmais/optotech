from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from ..views.redis import RedisView

import os

def authentication_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):      
        # Agora você pode acessar os cookies
     
        cookies = args[0].COOKIES 
        token = cookies.get("token")  

        if not token:
            response = Response({"detail": "No token provided"}, status=status.HTTP_401_UNAUTHORIZED)
            if 'token' not in cookies:
                response.delete_cookie("token")
            
            return response

        token_validated = verify_jwt_token(token, os.environ.get("PRIVATE_KEY"))

        if token and token_validated and not isinstance(token_validated, str):
            payload = token_validated
            
            user_id = payload.get("user_id")
            # Faça algo se o usuário estiver autenticado
            return view_func(request, *args, **kwargs, user_id = user_id)
        
        response = Response({"detail": token_validated})
        response.delete_cookie("token")
        
        return response

    return wrapper

import jwt
from datetime import datetime
def verify_jwt_token(token, public_key, jwt_algorithm='HS256'):
    try:
        # Decodificar o token
        payload = jwt.decode(token, public_key, algorithms=[jwt_algorithm])
      
        # Verificar a expiração
        current_time = datetime.utcnow()
        expiration_time = datetime.utcfromtimestamp(payload['exp'])
        if current_time > expiration_time:
            return "Expired time"
        
        redis_instance = RedisView()
                
        if redis_instance.is_token_in_blacklist(payload):
            return "Token invalidatd by the server"

        # O token é válido, retorne o payload
        return payload

    except jwt.ExpiredSignatureError as e:
        return str(e)
    
    except jwt.InvalidTokenError as e:
        return str(e)
    