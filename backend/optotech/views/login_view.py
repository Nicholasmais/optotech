from rest_framework import viewsets
from ..models.user import User
from ..serializers.user_serializer import UserSerializer
from rest_framework.response import Response
import bcrypt
from django.http import HttpResponse
from django.utils import timezone

class LoginViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def login(self, request):
        body = request.data
        
        if not User.objects.filter(email=body.get("email")):
            raise Exception("Usuário não encontrado")

        user = User.objects.get(email=body.get("email"))

        password_bytes = body["password"].encode("ascii")

        if not bcrypt.checkpw(password_bytes, user.password.encode("utf-8")):
            raise Exception("Senha incorreta")                        

        request.session["user"] = str(user.id)    

        user = UserSerializer(user).data    
        del user["password"]

        return self.is_authenticated(request)
		
    def is_authenticated(self, request):     
        is_auth = False
        user = None      

        if request.session.get("user", False):
            is_auth = True
            user = request.session.get("user")
            user_model = User.objects.get(id = user)
            user = UserSerializer(user_model).data    
            del user["password"]

            if request.session.get_expiry_date() <= timezone.now():
                self.clean_session(request)
                return
            
            user["expirationDate"] = request.session.get_expiry_date()

        response = {
            "isAuth" : is_auth,
            "user": user
        }

        return Response(response)
    
    def logout(self, request):
        request.session.flush()
        response = HttpResponse("Sessão apagada e cookies limpos.")
        
        for cookie in request.COOKIES:
            response.delete_cookie(cookie)
        
        return response
            