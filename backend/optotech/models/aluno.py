from django.db import models
import uuid

class Aluno(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    codigo = models.CharField(max_length=40, default=None)
    nome = models.CharField(max_length=40,null=False)
    data_nascimento = models.DateTimeField(null = False)
    data_criacao = models.DateTimeField(auto_now_add=True, null = False )

    class Meta:
        db_table = 'alunos'
