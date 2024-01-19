from rest_framework import viewsets

from ..utils.custom_exception_handler import CustomAPIException
from ..models.paciente import Paciente
from ..serializers.paciente_serializer import PacienteSerializer
from ..models.user_pacientes import UserPacientes
from ..serializers.user_pacientes_serializer import UserPacientesSerializer
from rest_framework.response import Response
from datetime import date, datetime
from dateutil.relativedelta import relativedelta
from ..decorator.is_auth import authentication_required
from .encryption import EncryptionTools
from .mongo import MongoView

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    encryption = EncryptionTools()
    mongo = MongoView()

    def retrieve(self, request, pk):        
        paciente_user = Paciente.objects.get(id = pk)
        paciente_user = PacienteSerializer(paciente_user)
        paciente_user = paciente_user.data
        paciente_user["idade"] = self.__calculate_idade__(paciente_user.get("data_nascimento"))
        paciente_user["nome"] = self.encryption.uncipher(paciente_user["nome"])
        paciente_user["data_nascimento"] = datetime.strptime(paciente_user["data_nascimento"][:10], '%Y-%m-%d').strftime("%d/%m/%Y")
        paciente_user["aditional_info"] = self.mongo.get({}, patient_id=paciente_user["id"]).data
        return Response(paciente_user)
    
    @authentication_required
    def list(self, request, user_id = None):
        pacientes_user = UserPacientes.objects.filter(user = user_id)
        
        pacientes = []
        for user_paciente in pacientes_user:
            paciente_model = Paciente.objects.get(id = str(user_paciente.paciente_id))
            paciente_dict = PacienteSerializer(paciente_model).data
            paciente_dict["idade"] = self.__calculate_idade__(paciente_dict.get("data_nascimento"))      
            paciente_dict["nome"] = self.encryption.uncipher(paciente_dict.get("nome"))
            pacientes.append(paciente_dict)

        pacientes = sorted(pacientes, key = lambda paciente: paciente["data_criacao"], reverse = True)
        return Response(pacientes)
    
    @authentication_required
    def create(self, request, user_id = None):
        body = request.data
        
        body["data_nascimento"] = self.__transform_date__(body["data_nascimento"])
        
        body["nome"] = self.encryption.cipher(body["nome"], to_string=True)

        serializer = self.serializer_class(data = body)
        if serializer.is_valid():
            instance = serializer.save()

            for aditional_info_row in body["aditional_info"]:
                self.mongo.post(body = {
                    **aditional_info_row,
                    "patient_id" : str(instance.id)
                    }
                )
            
        else:
            print(serializer.errors)
            raise CustomAPIException(serializer.errors, 400)
        
        if user_id:
            user_paciente_serializer = UserPacientesSerializer(data = {
                "user": user_id,
                "paciente":str(instance.id)
                })
            if user_paciente_serializer.is_valid():
                user_paciente_serializer.save()
            else:            
                raise CustomAPIException(user_paciente_serializer.errors, 400)
        return Response({**serializer.data, "id":instance.id})

    def destroy(self, request, pk):
        paciente = Paciente.objects.get(id=pk)

        paciente.ativo = not paciente.ativo
        paciente.save()

        return Response({})

    def __calculate_idade__(self, data_nascimento):        
        data_nascimento = datetime.strptime(data_nascimento[:10], '%Y-%m-%d')

        data_atual = datetime.now()
        
        return relativedelta(data_atual, data_nascimento).years
    
    def __transform_date__(self, date_string):
        date_string_list = date_string.split("-")
        year = int(date_string_list[0])
        month = int(date_string_list[1])
        day = int(date_string_list[2])
        return datetime(year, month, day)