from rest_framework import serializers
from ..models.aluno import Aluno

class AlunoSerializer(serializers.ModelSerializer):
    class Meta():
        model = Aluno
        fields = '__all__'  