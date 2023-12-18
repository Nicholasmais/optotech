from rest_framework import viewsets
from ..models.user import User
from ..serializers.user_serializer import UserSerializer
from rest_framework.response import Response
import bcrypt
from django.http import HttpResponse
from django.utils import timezone
from ..utils.custom_exception_handler import CustomAPIException
from django.contrib.sessions.models import Session
import jwt
from datetime import datetime, timedelta
import os
from .encryption import EncryptionTools
from ..decorator.is_auth import authentication_required

class LoginViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    encryption = EncryptionTools()

    def login(self, request):
        body = request.data

        encrypted_email = self.encryption.cipher(body.get("email")).decode('utf-8')

        if not User.objects.filter(email=encrypted_email):
            raise CustomAPIException("Usuário não encontrado", 404)

        user = User.objects.get(email=encrypted_email)

        password_bytes = body["password"].encode("utf-8")

        try:
            if not bcrypt.checkpw(password_bytes, user.password.encode("utf-8")):
                raise CustomAPIException("Senha incorreta", 401)
        except Exception as e:
            raise CustomAPIException(str(e), 401)

        # Gere uma chave secreta aleatória com 32 bytes (256 bits)
        jwt_secret_key = os.environ.get("PRIVATE_KEY")       
        jwt_algorithm = 'HS256'

        # Set the expiration time for the token
        expiration_time = datetime.utcnow() + timedelta(hours=1)  # Adjust as needed

        # Create the JWT payload
        payload = {
            'user_id': str(user.id),
            'exp': expiration_time
        }

        # Generate the JWT

        token = jwt.encode(payload, jwt_secret_key, algorithm=jwt_algorithm)

        user = UserSerializer(user).data    
        del user["password"]
  
        return Response({"token":f"Bearer {token}"})
    
    def logout(self, request):
        request.session.flush()
        response = HttpResponse("Sessão apagada e cookies limpos.")
        
        for cookie in request.COOKIES:
            response.delete_cookie(cookie)
        
        return response
       
    def check_cookie(self, request):
        return Response({"cookies":request.COOKIES})
    
    @authentication_required
    def is_authenticated(self, request, user_id):
        if not user_id:
            return Response({
                "isAuth": False,
                "user": None
            })
        
        user = User.objects.get(id = user_id)
        user_seriailizer = UserSerializer(user)
        data = user_seriailizer.data

        email = data.get("email")
        decrypted_email = self.encryption.uncipher(email)
        data["email"] = decrypted_email
        user = data.get("user")
        decrypted_user = self.encryption.uncipher(user)
        data["user"] = decrypted_user
        
        response = {
            "isAuth": True if user_id else False,
            "user": data
        }

        return Response(response)

    def __load_private_key__(self):
        from cryptography.hazmat.backends import default_backend
        from cryptography.hazmat.primitives import serialization
        import os

        current_directory = os.getcwd()
        key_path = os.path.abspath(current_directory + r"/../certificates/private_key.pem")

        with open(key_path, "rb") as key_file:
            private_key = serialization.load_pem_private_key(
                key_file.read(),
                password=None,  # A senha, se aplicável
                backend=default_backend()
            )

        return private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=serialization.NoEncryption()
        ).decode('utf-8')
   