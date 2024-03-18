from django.db import models
import uuid
from .user_pacientes import UserPacientes

class Appointment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    paciente_usuario = models.ForeignKey(UserPacientes, to_field="id", on_delete=models.PROTECT)
    acuidade = models.CharField(max_length=15,null=False)    
    data_atendimento = models.DateTimeField(auto_now_add=True, null = False )

    class Meta:
        db_table = 'atendimentos'
