from rest_framework import viewsets
from rest_framework.response import Response
from ..models.appointment import Appointment
from ..serializers.appointment_serializer import AppointmentSerializer
from ..utils.custom_exception_handler import CustomAPIException
from .paciente import Paciente
from ..serializers.paciente_serializer import PacienteSerializer
from ..models.user_pacientes import UserPacientes
import datetime
from ..decorator.is_auth import authentication_required
from .encryption import EncryptionTools

class AppointmentView(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer = AppointmentSerializer
    encryption = EncryptionTools()

    @authentication_required
    def user_appointments(self, request, user_id = None):
        # Altere a consulta para usar a nova coluna paciente_usuario_id
        user_patient_list = UserPacientes.objects.filter(user_id=user_id)
        appointments_list = []

        for user_patient in user_patient_list:
            if not Appointment.objects.filter(paciente_usuario_id = str(user_patient.id)).exists():
                continue

            atendimentos = Appointment.objects.filter(paciente_usuario_id = str(user_patient.id))
            for atendimento in atendimentos:
                appointment_dict = AppointmentSerializer(atendimento).data

                # Agora, o paciente está diretamente ligado ao appointment, então você pode obter os dados do paciente diretamente
                paciente_model = Paciente.objects.get(id=str(user_patient.paciente_id))
                paciente_dict = PacienteSerializer(paciente_model).data                
                paciente_dict["nome"] = self.encryption.uncipher(paciente_dict["nome"])
                
                appointment_dict["paciente"] = paciente_dict
                appointment_dict["date_time"] = self.transform_date(appointment_dict["data_atendimento"])
                
                appointments_list.append(appointment_dict)
        
        appointments_list_sorted = sorted(appointments_list, key= lambda appointment: appointment["date_time"], reverse=True)
        return Response(appointments_list_sorted)
    
    @authentication_required
    def create(self, request, user_id = None):      
        patient_id = request.data.get("paciente")

        user_patient_id = UserPacientes.objects.get(user_id = user_id, paciente_id = patient_id)

        appointment_seriailzer = AppointmentSerializer(data = {**request.data, "user":user_id, "paciente_usuario":str(user_patient_id.id)})
        if appointment_seriailzer.is_valid():
            instance = appointment_seriailzer.save()
            return Response({**request.data, "user":user_id, "id":instance.id})
        raise CustomAPIException(appointment_seriailzer.errors, 400)
    
    def transform_date(self, date):
        date = date.split("/")
        return datetime.date(int(date[2]), int(date[1]), int(date[0]))