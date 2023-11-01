from rest_framework import viewsets

from ..utils.custom_exception_handler import CustomAPIException
from ..models.aluno import Aluno
from ..serializers.aluno_serializer import AlunoSerializer
from ..models.appointment import Appointment
from ..serializers.appointment_serializer import AppointmentSerializer
from ..models.user_appointments import UserAppointments
from ..models.aluno import Aluno
from ..serializers.aluno_serializer import AlunoSerializer
from ..models.user_alunos import UserAlunos
from ..serializers.user_alunos_serializer import UserAlunosSerializer
from rest_framework.response import Response

class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer

    def list(self, request):
        user_id = request.session.get("user")
        
        alunos_user = UserAlunos.objects.filter(user = user_id)
        
        alunos = []
        for user_aluno in alunos_user:
            aluno_model = Aluno.objects.get(id = str(user_aluno.aluno_id))
            aluno_dict = AlunoSerializer(aluno_model).data
            alunos.append(aluno_dict)

        alunos = sorted(alunos, key = lambda aluno: aluno["data_criacao"], reverse = True)
        return Response(alunos)
    
    def create(self, request):  
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            instance = serializer.save()
        else:
            raise CustomAPIException(serializer.errors, 400)
        
        user_id = request.session.get("user")

        if user_id:
            user_aluno_serializer = UserAlunosSerializer(data = {
                "user": user_id,
                "aluno":str(instance.id)
                })
            if user_aluno_serializer.is_valid():
                user_aluno_serializer.save()                
            raise CustomAPIException(user_aluno_serializer.errors, 400)
        return Response({**serializer.data, "id":instance.id})

    def destroy(self, request, pk):
        aluno_appointments_model = Appointment.objects.filter(aluno = pk)

        if aluno_appointments_model:
            for aluno_model in aluno_appointments_model:
                aluno_dict = AppointmentSerializer(aluno_model).data
                aluno_appointment_id = aluno_dict.get("id")
                UserAppointments.objects.filter(appointment = aluno_appointment_id).delete()
                aluno_appointments_model.delete()
        
        Aluno.objects.filter(id = pk).delete()

        return Response({})
