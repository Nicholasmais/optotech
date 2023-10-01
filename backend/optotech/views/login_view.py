from rest_framework import viewsets
from ..models.user import User
from ..serializers.user_serializer import UserSerializer
from rest_framework.response import Response

class LoginViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer

	def create(self, request):
		if not User.objects.filter(email = request.data.get("email")):
			raise Exception("Usuário não encontrado")
		
		user = User.objects.get(email = request.data.get("email"))
		if user.password != request.data.get("password"):
			raise Exception("Senha incorreta")
		
		return Response(self.serializer_class(user).data)