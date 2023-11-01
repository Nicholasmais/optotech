from django.db import models
import uuid
from .user import User
from .aluno import Aluno

class UserAlunos(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, to_field="id", on_delete=models.PROTECT)  
    aluno = models.ForeignKey(Aluno, to_field="id", on_delete=models.PROTECT)

    class Meta:
        db_table = 'user_alunos'
