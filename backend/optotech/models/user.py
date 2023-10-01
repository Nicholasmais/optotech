from django.db import models
import bcrypt, uuid

class UserBase(models.Model):
    user = models.CharField(max_length=40,null=False, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    class Meta:
        abstract = True

    def __str__(self):
        return self.user

    def set_password(self, raw_password):
        self.password = bcrypt.hashpw(raw_password.encode(), bcrypt.gensalt())

    def check_password(self, raw_password):
        return bcrypt.checkpw(raw_password.encode(), self.password)

class User(UserBase):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        db_table = 'users'
