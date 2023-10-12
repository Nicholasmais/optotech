from rest_framework import serializers
from ..models.user_appointments import UserAppointments

class UserAppointmentsSerializer(serializers.ModelSerializer):
    class Meta():
        model = UserAppointments
        fields = '__all__'  