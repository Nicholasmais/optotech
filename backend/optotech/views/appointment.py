from rest_framework import viewsets
from rest_framework.response import Response
from ..models.appointment import Appointment
from ..serializers.appointment_serializer import AppointmentSerializer
from ..models.user_appointments import UserAppointments
from ..serializers.user_appointment_serializer import UserAppointmentsSerializer
from ..utils.custom_exception_handler import CustomAPIException

class AppointmentView(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer = AppointmentSerializer

    def user_appointments(self, request):
        user_id = request.session.get("user")
        user_appointments = UserAppointments.objects.filter(user_id = user_id)
        appointments_list = []

        for appointment in user_appointments:
            appointment_model = Appointment.objects.get(id = str(appointment.appointment_id))
            appointment_dict = AppointmentSerializer(appointment_model).data
            appointments_list.append(appointment_dict)

        return Response(appointments_list)

    def create(self, request):      
        user_id = request.session.get("user")
        appointment_seriailzer = AppointmentSerializer(data = request.data)
        if appointment_seriailzer.is_valid():
            instance = appointment_seriailzer.save()
            
            user_appointment_seriailzer = UserAppointmentsSerializer(data = {"user":user_id, "appointment": str(instance.id)})
            if user_appointment_seriailzer.is_valid():
                user_appointment_seriailzer.save()
                return Response({
                    **request.data, 
                    "id": str(instance.id)
                    })
        raise CustomAPIException(appointment_seriailzer.errors, 400)
    
    def teste(self, request):
        created_appointments = []
        for appointment in request.data:
            appointment_seriailzer = UserAppointmentsSerializer(data = appointment)
            if appointment_seriailzer.is_valid():
                appointment_seriailzer.save()
                created_appointments.append(appointment_seriailzer.data)
            else:
                created_appointments.append(appointment_seriailzer.errors)
        return Response(created_appointments)