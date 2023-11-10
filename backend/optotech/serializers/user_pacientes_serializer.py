from rest_framework import serializers
from ..models.user_pacientes import UserPacientes

class UserPacientesSerializer(serializers.ModelSerializer):
    class Meta():
        model = UserPacientes
        fields = '__all__'  