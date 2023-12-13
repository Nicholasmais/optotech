from rest_framework.views import APIView
from rest_framework.response import Response

from ..models.appointment import Appointment
from ..serializers.appointment_serializer import AppointmentSerializer
from ..models.paciente import Paciente
from ..serializers.paciente_serializer import PacienteSerializer
from ..models.user_pacientes import UserPacientes
from django.db import connection
from datetime import datetime
from ..decorator.is_auth import authentication_required

class ReportComparison(APIView):
    
    @authentication_required
    def get(self, request, user_id = None):        
        self.olho_direito = self.__treat_bool__(request.GET.get("isRight", "true"))
        self.all_patients = self.__treat_bool__(request.GET.get("isAllPatients", "true"))
        self.initial_date = request.GET.get("initialDate", None)
        self.final_date = request.GET.get("finalDate", None)        
        
        self.user_id = None
        if not self.all_patients:
            self.user_id = user_id

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
        select a.acuidade, p.nome, p.ativo, a.data_atendimento, u.id
            from atendimentos a
            inner join pacientes_usuarios pu on pu.id = a.paciente_usuario_id
            inner join usuarios u on u.id = pu.user_id
            inner join pacientes p on p.id = pu.paciente_id
            {"where u.id ='" + self.user_id + "'" if self.user_id else ""}
            {"and a.data_atendimento >= '" + self.initial_date + "'"  if self.initial_date and not self.final_date else ''}
            {"and a.data_atendimento <= '" + self.final_date + "'"  if self.final_date and not self.initial_date else ''}
            {"and a.data_atendimento between '" + self.initial_date + "'" + "and" + f"'{self.final_date}'" if self.initial_date and self.final_date else ''}
	      order by p.nome, a.data_atendimento desc;
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

    @authentication_required
    def get(self, request, user_id = None):
        self.all_patients = self.__treat_bool__(request.GET.get("isAllPatients", "true"))
        self.initial_date = request.GET.get("initialDate", None)
        self.final_date = request.GET.get("finalDate", None)

        self.user_id = None
        if not self.all_patients:
            self.user_id = user_id

        all_patients = self.__raw_query__(True)
        all_appointments = self.__raw_query__(False)

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
    
    def __raw_query__(self, paciente = True):        
        consulta_sql = f"""
        select p.* from pacientes p 
            inner join pacientes_usuarios pu 
            on p.id = pu.paciente_id 
            {"where pu.user_id ='" + self.user_id + "'" if self.user_id else ""}            
        ;
        """
        if not paciente:
           consulta_sql = f"""
            select a.* from atendimentos a
                inner join pacientes_usuarios pu
                on a.paciente_usuario_id = pu.id 
                {"where pu.user_id ='" + self.user_id + "'" if self.user_id else ""}
                {"and a.data_atendimento >= '" + self.initial_date + "'"  if self.initial_date and not self.final_date else ''}
                {"and a.data_atendimento <= '" + self.final_date + " 23:59:59'"  if self.final_date and not self.initial_date else ''}
                {"and a.data_atendimento between '" + self.initial_date + "'" + "and" + f"'{self.final_date} 23:59:59'" if self.initial_date and self.final_date else ''} 
            ;
            """ 
        
        resultados = []

        with connection.cursor() as cursor:
            cursor.execute(consulta_sql)
            colunas = [col[0] for col in cursor.description]  # Obtém os nomes das colunas
            for row in cursor.fetchall():
                resultados.append(dict(zip(colunas, row)))
        
        return resultados

    def __count_patient__(self, patients):
        ativo, inativo = 0, 0
        for patient in patients:
            if patient.get("ativo"):
                ativo += 1
            else:
                inativo += 1
        return ativo, inativo
    
    def __count_appointment__(self, appointments):
        ativo, inativo = 0, 0
        for appointment in appointments:
            paciente_obj = UserPacientes.objects.get(id = appointment.get("paciente_usuario_id"))
            paciente = Paciente.objects.get(id = paciente_obj.paciente_id)
            if paciente.ativo:
                ativo += 1
            else:
                inativo += 1
        return ativo, inativo

    def __treat_bool__(self, bool_string):
        return bool_string == "true"

class ReportDemographic(APIView):

    @authentication_required
    def get(self, request, user_id = None):
        self.all_patients = self.__treat_bool__(request.GET.get("isAllPatients", "true"))
        self.initial_date = request.GET.get("initialDate", None)
        self.final_date = request.GET.get("finalDate", None)
        self.olho_direito = self.__treat_bool__(request.GET.get("isRight", "true"))
        self.user_id = None
        
        if not self.all_patients:
            self.user_id = user_id
              
        resultados_sql = self.__raw_query__(f"""
            SELECT 
                {"SPLIT_PART(a.acuidade, '.', 1) AS direito" if self.olho_direito else "SPLIT_PART(a.acuidade, '.', 2) AS esquerdo"},
                FLOOR(EXTRACT(YEAR FROM AGE(a.data_atendimento, p.data_nascimento)) / 10) * 10 AS faixa_etaria,
                COUNT(*) AS quantidade
            FROM 
                atendimentos a
                INNER JOIN pacientes_usuarios pu ON pu.id = a.paciente_usuario_id 
                INNER JOIN pacientes p ON p.id = pu.paciente_id 
            {f"where pu.user_id = '{self.user_id}'" if self.user_id else ''}
            {"and a.data_atendimento >= '" + self.initial_date + "'"  if self.initial_date and not self.final_date else ''}
            {"and a.data_atendimento <= '" + self.final_date + " 23:59:59'"  if self.final_date and not self.initial_date else ''}
            {"and a.data_atendimento between '" + self.initial_date + "'" + "and" + f"'{self.final_date} 23:59:59'" if self.initial_date and self.final_date else ''} 
            GROUP BY 
                {"SPLIT_PART(a.acuidade, '.', 1)" if self.olho_direito else "SPLIT_PART(a.acuidade, '.', 2)"},
                FLOOR(EXTRACT(YEAR FROM AGE(a.data_atendimento, p.data_nascimento)) / 10)
        """)

        lista_resultados = []

        for resultado in resultados_sql:
            acuidade = resultado.get("direito") if self.olho_direito else resultado.get("esquerdo")  # valor da coluna 'direito'
            faixa_etaria = int(resultado.get("faixa_etaria"))  # valor da faixa etária
            quantidade = resultado.get("quantidade")  # quantidade de atendimentos

            lista_resultados.append({
                "x": acuidade,
                "y": faixa_etaria,
                "r": quantidade
            })

        return Response(lista_resultados)
    
    def __raw_query__(self, query):
        resultados = []

        with connection.cursor() as cursor:
            cursor.execute(query)
            colunas = [col[0] for col in cursor.description]  # Obtém os nomes das colunas
            for row in cursor.fetchall():
                resultados.append(dict(zip(colunas, row)))
        
        return resultados
        
    def __treat_bool__(self, bool_string):
        return bool_string == "true"

class ReportMaxMinDate(APIView):
    def get(self, request):
        most_recent_date = self.__raw_query__("""
            select MAX(data_atendimento) from
            (select * from atendimentos a
                inner join pacientes_usuarios pu on pu.id = a.paciente_usuario_id
                inner join pacientes p on p.id = pu.paciente_id
                where p.ativo is true) ;
            """)
        least_recent_date = self.__raw_query__("""
            select MIN(data_atendimento) from
            (select * from atendimentos a
                inner join pacientes_usuarios pu on pu.id = a.paciente_usuario_id
                inner join pacientes p on p.id = pu.paciente_id
                where p.ativo is true) ;
            """)
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

class ReportPatientAppointments(APIView):
    def get(self, request):
        self.patient = request.GET.get("patient", None)

        self.olho_direito = self.__treat_bool__(request.GET.get("isRight", "true"))

        if not self.patient:
            return Response([])
        
        self.initial_date = request.GET.get("initialDate", None)

        self.final_date = request.GET.get("finalDate", None)

        query = f"""
        SELECT 
            TO_CHAR(a.data_atendimento, 'YYYY-MM-DD') AS time,
            {"SPLIT_PART(a.acuidade, '.', 1) AS acuity" if self.olho_direito else "SPLIT_PART(a.acuidade, '.', 2) AS acuity"}
        FROM 
            atendimentos a
            INNER JOIN pacientes_usuarios pu ON pu.id = a.paciente_usuario_id 
            INNER JOIN pacientes p ON p.id = pu.paciente_id
        WHERE 
            p.id = '{self.patient}'
            {"and a.data_atendimento >= '" + self.initial_date + "'"  if self.initial_date and not self.final_date else ''}
            {"and a.data_atendimento <= '" + self.final_date + " 23:59:59'"  if self.final_date and not self.initial_date else ''}
            {"and a.data_atendimento between '" + self.initial_date + "'" + "and" + f"'{self.final_date} 23:59:59'" if self.initial_date and self.final_date else ''} 
        ORDER BY 
            a.data_atendimento;
        """

        lista_resultados = self.__raw_query__(query)
        
        return Response(lista_resultados)
    
    def __raw_query__(self, query):
        resultados = []

        with connection.cursor() as cursor:
            cursor.execute(query)
            colunas = [col[0] for col in cursor.description]  # Obtém os nomes das colunas
            for row in cursor.fetchall():
                resultados.append(dict(zip(colunas, row)))
        
        return resultados      

    def __treat_bool__(self, bool_string):
        return bool_string == "true"
