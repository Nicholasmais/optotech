from django.db import models
import uuid
from .aluno import Aluno
from .user import User
class Appointment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    aluno = models.ForeignKey(Aluno, to_field="id", on_delete=models.PROTECT)
    user = models.ForeignKey(User, to_field="id", on_delete=models.PROTECT)
    acuidade = models.CharField(max_length=7,null=False)    
    data_atendimento = models.DateTimeField(auto_now_add=True, null = False )

    class Meta:
        db_table = 'appointments'
