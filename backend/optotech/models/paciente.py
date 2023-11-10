from django.db import models
import uuid

class Paciente(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    codigo = models.CharField(max_length=40, default=None)
    nome = models.CharField(max_length=40,null=False)
    data_nascimento = models.DateTimeField(null = False)
    data_criacao = models.DateTimeField(auto_now_add=True, null = False )
    ativo = models.BooleanField(default=True)
    class Meta:
        db_table = 'pacientes'
