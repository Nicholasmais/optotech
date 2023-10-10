from rest_framework import viewsets
from ..models.user import User
from ..serializers.user_serializer import UserSerializer
from rest_framework.response import Response
import bcrypt
from ..utils.custom_exception_handler import CustomAPIException

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def signup(self, request):
        body = request.data

        if User.objects.filter(email=body.get("email")):
          raise CustomAPIException("Email já cadastrado.", 409)
      
        if User.objects.filter(user=body.get("user")):
          raise CustomAPIException("Usuário já cadastrado.", 409)
      
        serializer = self.serializer_class(data = request.data)
        
        if serializer.is_valid():

            salt = bcrypt.gensalt()
            password_bytes = body["password"].encode("ascii")
            password_hashed = bcrypt.hashpw(password_bytes, salt)
            
            body["password"]  = password_hashed.decode("utf-8")
   
            serializer = self.serializer_class(data = body)

            if serializer.is_valid():
                instance = serializer.save()
                return Response({**serializer.data, "id":instance.id})
            raise CustomAPIException(serializer.errors)
        raise CustomAPIException(serializer.errors)