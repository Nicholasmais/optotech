from django.db import models
import uuid
from .user import User
from .appointment import Appointment

class UserAppointments(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, to_field="id", on_delete=models.PROTECT)  
    appointment = models.ForeignKey(Appointment, to_field="id", on_delete=models.PROTECT)

    class Meta:
        db_table = 'user_appointments'
