from functools import wraps
from rest_framework.response import Response
from rest_framework import status
import os

def authentication_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):      
        # Agora você pode acessar os cookies

        cookies = args[0].COOKIES 
        token = cookies.get("token")  
        token_validated = verify_jwt_token(token, os.environ.get("PRIVATE_KEY"))

        if token and token_validated:
            payload = token_validated
            
            user_id = payload.get("user_id")
            # Faça algo se o usuário estiver autenticado
            return view_func(request, *args, **kwargs, user_id = user_id)

        return Response({"detail": "Usuário não autenticado", 'more-detail':debug(token, os.environ.get("PRIVATE_KEY"), cookies, args, request)}, status=status.HTTP_401_UNAUTHORIZED)

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
    
def debug(token, public_key,cookies, args,request,  jwt_algorithm='HS256'):
    try:
        # Decodificar o token
        payload = jwt.decode(token, public_key, algorithms=[jwt_algorithm])
      
        # Verificar a expiração
        current_time = datetime.utcnow()
        expiration_time = datetime.utcfromtimestamp(payload['exp'])
        if current_time > expiration_time:
            print("expired time")
            return 'expired time'

        # O token é válido, retorne o payload
        return 'suces'

    except jwt.ExpiredSignatureError as e:
        print(e)
        return {
            "eero":str(e),
            'token':str(token),
            'tokenTtype':str(type(token)),
            'key':public_key
            }
    except jwt.InvalidTokenError as e:
        print(e)
        return {
            "eero":str(e),
            'token':str(token),
            'tokenTtype':str(type(token)),
            'key':public_key,
            'cookies':cookies,
            'args':str(args),
            'args[0]':str(args[0]) ,
            'cookie[0]':str(args[0].COOKIES),
            'request':str(request) ,
            'teste':"t"


            }