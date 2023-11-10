from rest_framework.views import APIView
from rest_framework.response import Response

from ..models.appointment import Appointment
from ..serializers.appointment_serializer import AppointmentSerializer
from ..models.paciente import Paciente
from ..serializers.paciente_serializer import PacienteSerializer
from django.db import connection
from datetime import datetime

class ReportComparison(APIView):
    def get(self, request):        
        self.olho_direito = self.__treat_bool__(request.GET.get("isRight", "true"))
        self.all_patients = self.__treat_bool__(request.GET.get("isAllPatients", "true"))
        
        self.user_id = None
        if not self.all_patients:
            try:
                self.user_id = request.session.get("user")
            except Exception as e:
                self.user_id = None

        resultados = self.__raw_query__()

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
        consulta_sql = f"""
        select a.acuidade, al.nome, al.ativo, a.data_atendimento, u.id
          from appointments a
          inner join pacientes al on a.paciente_id = al.id
          inner join user_pacientes ua on ua.paciente_id = al.id
          inner join users u on u.id = ua.user_id
          {"where u.id ='" + self.user_id + "'" if self.user_id else ""}
	      order by al.nome, a.data_atendimento desc;
        """

        resultados = []

        with connection.cursor() as cursor:
            cursor.execute(consulta_sql)
            colunas = [col[0] for col in cursor.description]  # Obtém os nomes das colunas
            for row in cursor.fetchall():
                resultados.append(dict(zip(colunas, row)))
        
        return resultados
    
    def __count_equal__(self, array_querySet):
        equal = 0
        for query_set in array_querySet:            
            if not query_set.get("ativo"):
                continue

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
            if not query_set.get("ativo"):
                continue
            print(query_set.get("acuidade"))
            print(self.olho_direito)
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
            if not query_set.get("ativo"):
                continue

            if not self.olho_direito:                   
                if int(query_set.get("acuidade")[query_set.get("acuidade").index("/")+1:query_set.get("acuidade").index(".")]) > 20:
                    greater += 1
            else:                
                if int(query_set.get("acuidade")[query_set.get("acuidade").rindex("/")+1:]) > 20:
                    greater += 1
        
        return greater
        
class ReportActive(APIView):
    def get(self, request):
        all_patients = Paciente.objects.all()
        all_appointments = Appointment.objects.all()

        count_patient_active, count_patient_unactive = self.__count_patient__(all_patients)
        count_appointment_active, count_appointment_unactive = self.__count_appointment__(all_appointments)

        return Response({
            "patient": {
                "active": count_patient_active,
                "unActive" : count_patient_unactive
            },
            "appointment": {
                "active": count_appointment_active,
                "unActive" : count_appointment_unactive
            } 
        })
    
    def __count_patient__(self, patients):
        ativo, inativo = 0, 0
        for patient in patients:
            if patient.ativo:
                ativo += 1
            else:
                inativo += 1
        return ativo, inativo
    
    def __count_appointment__(self, appointments):
        ativo, inativo = 0, 0
        for appointment in appointments:
            paciente = Paciente.objects.get(id = appointment.paciente_id)
            if paciente.ativo:
                ativo += 1
            else:
                inativo += 1
        return ativo, inativo

class ReportDemographic(APIView):
    def get(self, request):
        self.olho_direito = self.__treat_bool__(request.GET.get("isRight", "true"))

        most_recent_date = self.__raw_query__("select MAX(data_atendimento) from appointments a ;")
        least_recent_date = self.__raw_query__("select MIN(data_atendimento) from appointments a ;")

        acuity_values = [
            {"20/200":{}},
            {"20/100":{}},
            {"20/70":{}},
            {"20/50":{}},
            {"20/40":{}},
            {"20/30":{}},
            {"20/25":{}}, 
            {"20/20":{}},
            {"20/15":{}},
            {"20/13":{}},
            {"20/10":{}}
        ]
        fist_obj = self.__raw_query__("select a.acuidade, a.data_atendimento , al.nome , al.data_nascimento  from appointments a inner join pacientes al on a.paciente_id = al.id ;")

        for snellen in acuity_values:
            for query_set in fist_obj:
                if not self.olho_direito:
                    if query_set.get("acuidade")[:query_set.get("acuidade").index(".")] == snellen:
                            equal += 1
                    else:
                        if query_set.get("acuidade")[query_set.get("acuidade").index(".")+1:] == snellen:
                            equal += 1
        
        
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
    
    def __raw_query__(self, query):
        with connection.cursor() as cursor:
            cursor.execute(query) 
            res =  cursor.fetchall()
            if len(res) == 1:
                return res[0]
            return res
        
    def __treat_bool__(self, bool_string):
        return bool_string == "true"

class ReportMaxMinDate(APIView):
    def get(self, request):
        most_recent_date = self.__raw_query__("select MAX(data_atendimento) from (select * from appointments a inner join pacientes al on a.paciente_id = al.id where al.ativo is true) ;")
        least_recent_date = self.__raw_query__("select MIN(data_atendimento) from (select * from appointments a inner join pacientes al on a.paciente_id = al.id where al.ativo is true) ;")
        default_most_recent = datetime(1970, 1, 1)
        default_least_recent = datetime.now()

        # Use the query result if it's not None, otherwise use the default value
        most_recent_date = most_recent_date[0] if most_recent_date and most_recent_date[0] else default_most_recent
        least_recent_date = least_recent_date[0] if least_recent_date and least_recent_date[0] else default_least_recent

        return Response({
            "mostRecent": most_recent_date.strftime('%Y-%m-%d'), 
            "leastRecent": least_recent_date.strftime('%Y-%m-%d')
        })
    
    def __raw_query__(self, query):
        with connection.cursor() as cursor:
            cursor.execute(query) 
            res =  cursor.fetchall()          
            if len(res) == 1:            
                return res[0]
            return res
