from rest_framework import viewsets
from ..models.user import User
from ..serializers.user_serializer import UserSerializer
from rest_framework.response import Response
import bcrypt
from django.http import HttpResponse
from django.utils import timezone
from ..utils.custom_exception_handler import CustomAPIException
from django.contrib.sessions.models import Session

class LoginViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def login(self, request):
        body = request.data
        
        if not User.objects.filter(email=body.get("email")):
            raise CustomAPIException("Usuário não encontrado", 404)

        user = User.objects.get(email=body.get("email"))

        password_bytes = body["password"].encode("ascii")

        try:
            if not bcrypt.checkpw(password_bytes, user.password.encode("utf-8")):
                raise CustomAPIException("Senha incorreta", 401)
        except Exception as e:
            raise CustomAPIException(str(e), 401)

        request.session["user"] = str(user.id)    
        request.session.save()

        user = UserSerializer(user).data    
        del user["password"]
  
        return Response({"url":f"auth/{request.session.session_key}"})
    
    def logout(self, request):
        request.session.flush()
        response = HttpResponse("Sessão apagada e cookies limpos.")
        
        for cookie in request.COOKIES:
            response.delete_cookie(cookie)
        
        return response
       
    def is_authenticated(self, request):
        is_auth = False
        user = None

        if not Session.objects.filter(session_key=request.COOKIES.get("sessionid")):
            response = {
                "isAuth": is_auth,
                "user": user
            }
            return Response(response)
        
        session = Session.objects.get(session_key=request.COOKIES.get("sessionid"))
             
        if session.expire_date <= timezone.now():
            response = {
                "isAuth": is_auth,
                "user": user
            }
            return Response(response)

        is_auth = True
        user = session.get_decoded()["user"]
        
        user_model = User.objects.get(id=user)
        user = UserSerializer(user_model).data

        del user["password"]

        user["expirationDate"] = session.expire_date

        response = {
            "isAuth": is_auth,
            "user": user
        }

        return Response(response)
       