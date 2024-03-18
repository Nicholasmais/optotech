from rest_framework import serializers
from ..models.appointment import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    data_atendimento = serializers.SerializerMethodField()
    
    class Meta():
        model = Appointment
        fields = '__all__'  

    def get_data_atendimento(self, obj):
        return obj.data_atendimento.strftime('%d/%m/%Y')