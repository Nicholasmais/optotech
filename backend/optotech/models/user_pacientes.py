from django.db import models
import uuid
from .user import User
from .paciente import Paciente

class UserPacientes(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, to_field="id", on_delete=models.PROTECT)  
    paciente = models.ForeignKey(Paciente, to_field="id", on_delete=models.PROTECT)

    class Meta:
        db_table = 'pacientes_usuarios'
