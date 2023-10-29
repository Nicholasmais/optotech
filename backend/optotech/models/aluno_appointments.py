from django.db import models
import uuid
from .aluno import Aluno
from .appointment import Appointment

class AlunoAppointments(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    aluno = models.ForeignKey(Aluno, to_field="id", on_delete=models.PROTECT)  
    appointment = models.ForeignKey(Appointment, to_field="id", on_delete=models.PROTECT)

    class Meta:
        db_table = 'aluno_appointments'
