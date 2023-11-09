from rest_framework.views import APIView
from rest_framework.response import Response

from ..models.appointment import Appointment
from ..serializers.appointment_serializer import AppointmentSerializer
from ..models.aluno import Aluno
from ..serializers.aluno_serializer import AlunoSerializer
from django.db import connection

class ReportComparison(APIView):
    def get(self, request):        
        self.olho_direito = self.__treat_bool__(request.GET.get("isRight"))

        resultados = self.__raw_query__()
        resultados = self.__serializer__(resultados)
        
        num_equal = self.__count_equal__(resultados)
        num_lower = self.__count_lower__(resultados)
        num_greater = self.__count_greater__(resultados)

        return Response({
            "superior" : num_greater,
            "igual" : num_equal,
            "inferior" : num_lower
        })

    def __treat_bool__(self, bool_string):
        return bool_string == "true"

    def __raw_query__(self):
        consulta_sql = """
        SELECT a.acuidade, a.user_id, a.aluno_id, a.data_atendimento
        FROM appointments a
        INNER JOIN (
            SELECT user_id, aluno_id, MAX(data_atendimento) AS MaxData
            FROM appointments
            GROUP BY user_id, aluno_id
        ) AS b ON a.user_id = b.user_id AND a.aluno_id = b.aluno_id AND a.data_atendimento = b.MaxData
        ORDER BY a.data_atendimento DESC;
        """

        resultados = []

        with connection.cursor() as cursor:
            cursor.execute(consulta_sql)
            colunas = [col[0] for col in cursor.description]  # Obtém os nomes das colunas
            for row in cursor.fetchall():
                resultados.append(dict(zip(colunas, row)))
        
        return resultados

    def __serializer__(self, array_querySet):
        for query_set in array_querySet:
            aluno = Aluno.objects.get(id = query_set.get("aluno_id"))
            aluno_obj = AlunoSerializer(aluno).data            
            query_set["aluno"] = aluno_obj            
        return array_querySet
    
    def __count_equal__(self, array_querySet):
        equal = 0
        for query_set in array_querySet:
            if not self.olho_direito:
                if query_set.get("acuidade")[:query_set.get("acuidade").index(".")] == "20/20":
                    equal += 1
            else:
                if query_set.get("acuidade")[query_set.get("acuidade").index(".")+1:] == "20/20":
                    equal += 1
        return equal

    def __count_lower__(self, array_querySet):
        lower = 0
        for query_set in array_querySet:
            if not self.olho_direito:                   
                if int(query_set.get("acuidade")[query_set.get("acuidade").index("/")+1:query_set.get("acuidade").index(".")]) < 20:
                    lower += 1
            else:                
                if int(query_set.get("acuidade")[query_set.get("acuidade").rindex("/")+1:]) < 20:
                    lower += 1
        return lower
    
    def __count_greater__(self, array_querySet):
            greater = 0
            for query_set in array_querySet:
                if not self.olho_direito:                   
                    if int(query_set.get("acuidade")[query_set.get("acuidade").index("/")+1:query_set.get("acuidade").index(".")]) > 20:
                        greater += 1
                else:                
                    if int(query_set.get("acuidade")[query_set.get("acuidade").rindex("/")+1:]) > 20:
                        greater += 1
            return greater
        
class ReportActive(APIView):
    def get(self, request):
        return Response({
            "patient": {
                "active": 40,
                "unActive" : 20
            },
            "appointment": {
                "active": 30,
                "unActive" : 10
            } 
        })

class ReportDemographic(APIView):
    def get(self, request):
        return Response([
            # Pacientes com 20/200 de visão
            { "x": "20/200", "y": 70, "r": 3 },
            { "x": "20/200", "y": 50, "r": 2 },
            { "x": "20/200", "y": 30, "r": 1 },
        
            # Pacientes com 20/100 de visão
            { "x": "20/100", "y": 65, "r": 5 },
            { "x": "20/100", "y": 45, "r": 3 },
            { "x": "20/100", "y": 20, "r": 2 },
        
            # Pacientes com 20/70 de visão
            { "x": "20/70", "y": 55, "r": 8 },
            { "x": "20/70", "y": 35, "r": 6 },
            { "x": "20/70", "y": 15, "r": 1 },
        
            # Pacientes com 20/50 de visão
            { "x": "20/50", "y": 40, "r": 7 },
            { "x": "20/50", "y": 25, "r": 5 },
            { "x": "20/50", "y": 10, "r": 2 },
        
            # Pacientes com 20/40 de visão
            { "x": "20/40", "y": 30, "r": 10 },
            { "x": "20/40", "y": 22, "r": 9 },
            { "x": "20/40", "y": 18, "r": 4 },
        
            # Pacientes com 20/30 de visão
            { "x": "20/30", "y": 20, "r": 12 },
            { "x": "20/30", "y": 10, "r": 15 },
        
            # Pacientes com 20/25 de visão
            { "x": "20/25", "y": 30, "r": 20 },
            { "x": "20/25", "y": 25, "r": 18 },
            { "x": "20/25", "y": 22, "r": 5 },
        
            # Pacientes com 20/20 de visão
            { "x": "20/20", "y": 25, "r": 25 },
            { "x": "20/20", "y": 35, "r": 30 },
            { "x": "20/20", "y": 18, "r": 40 },
            { "x": "20/20", "y": 10, "r": 50 },
        
            # Pacientes com 20/15 de visão
            { "x": "20/15", "y": 30, "r": 5 },
            { "x": "20/15", "y": 22, "r": 2 },
            { "x": "20/15", "y": 15, "r": 1 },
        
            # Pacientes com 20/13 de visão
            { "x": "20/13", "y": 27, "r": 2 },
            { "x": "20/13", "y": 19, "r": 1 },
        
            # Pacientes com 20/10 de visão
            { "x": "20/10", "y": 25, "r": 1 },
            { "x": "20/10", "y": 18, "r": 1 },
        ])