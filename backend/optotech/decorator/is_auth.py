from functools import wraps
from rest_framework.response import Response
from rest_framework import status
import os

def authentication_required(view_func):
    @wraps(view_func)
    def wrapper(self, *args, **kwargs):        
        # Agora você pode acessar os cookies
        cookies = self.request.COOKIES  

        if cookies.get("token") and verify_jwt_token(cookies.get("token"), os.environ.get("PRIVATE_KEY")):
            payload = verify_jwt_token(cookies.get("token"), os.environ.get("PRIVATE_KEY"))
            
            user_id = payload.get("user_id")
            # Faça algo se o usuário estiver autenticado
            return view_func(self, *args, **kwargs, user_id = user_id)

        return Response({"detail": "Usuário não autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

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
            print("expired time")
            return None

        # O token é válido, retorne o payload
        return payload

    except jwt.ExpiredSignatureError as e:
        print(e)
        return None
    except jwt.InvalidTokenError as e:
        print(e)
        return None