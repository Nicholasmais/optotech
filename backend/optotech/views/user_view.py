from rest_framework import viewsets
from ..models.user import User
from ..serializers.user_serializer import UserSerializer
from rest_framework.response import Response
import bcrypt

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            body = request.data

            salt = bcrypt.gensalt()
            password_bytes = body["password"].encode("ascii")
            password_hashed = bcrypt.hashpw(password_bytes, salt)
            
            body["password"]  = password_hashed.decode("utf-8")
   
            serializer = self.serializer_class(data = body)

            if serializer.is_valid():
                instance = serializer.save()
                return Response({**serializer.data, "id":instance.id})
            raise Exception(serializer.errors)
        raise Exception(serializer.errors)