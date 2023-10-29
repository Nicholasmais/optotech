from django.db import models
import uuid

class Aluno(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    codigo = models.CharField(max_length=40, default=None)
    paciente = models.CharField(max_length=40,null=False)
    idade = models.IntegerField(null = False)

    class Meta:
        db_table = 'alunos'
