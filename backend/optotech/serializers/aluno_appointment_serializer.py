from rest_framework import serializers
from ..models.aluno_appointments import AlunoAppointments

class AlunoAppointmentsSerializer(serializers.ModelSerializer):
    class Meta():
        model = AlunoAppointments
        fields = '__all__'  