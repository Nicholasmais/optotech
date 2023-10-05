from rest_framework import viewsets
from ..models.user import User
from ..serializers.user_serializer import UserSerializer
from rest_framework.response import Response
import bcrypt

class LoginViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request):
        body = request.data
        if not User.objects.filter(email=body.get("email")):
            raise Exception("Usuário não encontrado")

        user = User.objects.get(email=body.get("email"))

        password_bytes = body["password"].encode("ascii")

        if not bcrypt.checkpw(password_bytes, user.password.encode("utf-8")):
            raise Exception("Senha incorreta")        

        request.session["user"] = str(user.id)
        
        request.session.modified = True
        request.session.save()
        print("salvo")
        return Response(self.serializer_class(user).data)
		
    def list(self, request):
        print("SESSAO")
        for key, item in request.session.items():
            print(key, item)
        print("fim")
        
        visit = request.session.get('visit',0) + 1
        request.session['visit'] = visit
        print(request.session.get('visit'))
        session_data = dict(request.session)  # Converte a sessão em um dicionário
        return Response(session_data)