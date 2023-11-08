from rest_framework import viewsets
from rest_framework.response import Response
from ..models.appointment import Appointment
from ..serializers.appointment_serializer import AppointmentSerializer
from ..utils.custom_exception_handler import CustomAPIException
from .aluno import Aluno
from ..serializers.aluno_serializer import AlunoSerializer

class AppointmentView(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer = AppointmentSerializer

    def user_appointments(self, request):
        user_id = request.session.get("user")
        user_appointments = Appointment.objects.filter(user_id = user_id).order_by("-data_atendimento")
        appointments_list = []

        for appointment in user_appointments:
            appointment_model = Appointment.objects.get(id = str(appointment.id))
            appointment_dict = AppointmentSerializer(appointment_model).data

            aluno_model = Aluno.objects.get(id = appointment_dict.get("aluno"))
            aluno_dict = AlunoSerializer(aluno_model).data
            if not aluno_dict["ativo"]:
                continue
            
            appointment_dict["aluno"] = aluno_dict

            appointments_list.append(appointment_dict)

        return Response(appointments_list)

    def create(self, request):      
        user_id = request.session.get("user")
        appointment_seriailzer = AppointmentSerializer(data = {**request.data, "user":user_id})
        if appointment_seriailzer.is_valid():
            instance = appointment_seriailzer.save()
            return Response({**request.data, "user":user_id, "id":instance.id})
        raise CustomAPIException(appointment_seriailzer.errors, 400)
    