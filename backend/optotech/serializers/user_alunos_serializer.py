from rest_framework import serializers
from ..models.user_alunos import UserAlunos

class UserAlunosSerializer(serializers.ModelSerializer):
    class Meta():
        model = UserAlunos
        fields = '__all__'  