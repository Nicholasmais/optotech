from rest_framework import viewsets
from ..models.user import User
from ..serializers.user_serializer import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
