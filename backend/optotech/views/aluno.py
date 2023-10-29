from rest_framework import viewsets
from ..models.aluno import Aluno
from ..serializers.aluno_serializer import AlunoSerializer

class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer