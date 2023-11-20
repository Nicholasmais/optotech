from django.db import models
import uuid

class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.CharField(max_length=40,null=False, unique=False)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    dpi = models.IntegerField(default=96)

    class Meta:
        db_table = 'usuarios'
