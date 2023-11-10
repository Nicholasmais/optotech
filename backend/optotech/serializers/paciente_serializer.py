from rest_framework import serializers
from ..models.paciente import Paciente

class PacienteSerializer(serializers.ModelSerializer):
    class Meta():
        model = Paciente
        fields = '__all__'  