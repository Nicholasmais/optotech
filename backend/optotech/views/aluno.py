from rest_framework import viewsets

from ..utils.custom_exception_handler import CustomAPIException
from ..models.aluno import Aluno
from ..serializers.aluno_serializer import AlunoSerializer
from ..models.user_alunos import UserAlunos
from ..serializers.user_alunos_serializer import UserAlunosSerializer
from rest_framework.response import Response
from datetime import date, datetime
from dateutil.relativedelta import relativedelta

class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer

    def retrieve(self, request, pk):        
        aluno_user = Aluno.objects.get(id = pk)
        aluno_user = AlunoSerializer(aluno_user)
        aluno_user = aluno_user.data
        aluno_user["idade"] = self.__calculate_idade__(aluno_user.get("data_nascimento"))

        return Response(aluno_user)
    
    def list(self, request):
        user_id = request.session.get("user")
        
        alunos_user = UserAlunos.objects.filter(user = user_id)
        
        alunos = []
        for user_aluno in alunos_user:
            aluno_model = Aluno.objects.get(id = str(user_aluno.aluno_id))
            aluno_dict = AlunoSerializer(aluno_model).data
            aluno_dict["idade"] = self.__calculate_idade__(aluno_dict.get("data_nascimento"))
            alunos.append(aluno_dict)

        alunos = sorted(alunos, key = lambda aluno: aluno["data_criacao"], reverse = True)
        return Response(alunos)
    
    def create(self, request):
        body = request.data
        body["data_nascimento"] = self.__transform_date__(body["data_nascimento"])

        serializer = self.serializer_class(data = body)
        if serializer.is_valid():
            instance = serializer.save()
        else:
            print(serializer.errors)
            raise CustomAPIException(serializer.errors, 400)
        
        user_id = request.session.get("user")

        if user_id:
            user_aluno_serializer = UserAlunosSerializer(data = {
                "user": user_id,
                "aluno":str(instance.id)
                })
            if user_aluno_serializer.is_valid():
                user_aluno_serializer.save()
            else:            
                raise CustomAPIException(user_aluno_serializer.errors, 400)
        return Response({**serializer.data, "id":instance.id})

    def destroy(self, request, pk):
        aluno = Aluno.objects.get(id=pk)

        aluno.ativo = not aluno.ativo
        aluno.save()

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