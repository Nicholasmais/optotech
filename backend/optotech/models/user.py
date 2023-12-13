from django.db import models
import uuid

class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.CharField(max_length=128,null=False, unique=False)
    email = models.CharField(max_length=128, unique=True)
    password = models.CharField(max_length=128)
    dpi = models.IntegerField(null = True)

    class Meta:
        db_table = 'usuarios'        
