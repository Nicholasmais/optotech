from django.db import models
import uuid

class Appointment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    paciente = models.CharField(max_length=40,null=False)
    acuidade = models.CharField(max_length=7,null=False)
    idade = models.IntegerField(null = False)
    data_atendimento = models.DateTimeField(auto_now_add=True, null = False )

    class Meta:
        db_table = 'appointments'
