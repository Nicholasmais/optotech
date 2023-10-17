from django.db import models
import uuid

class MatrixLetter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)    
    a = models.CharField(max_length=40,null=False)
    b = models.CharField(max_length=40,null=False)
    c = models.CharField(max_length=40,null=False)
    d = models.CharField(max_length=40,null=False)
    e = models.CharField(max_length=40,null=False)
    f = models.CharField(max_length=40,null=False)
    g = models.CharField(max_length=40,null=False)
    h = models.CharField(max_length=40,null=False)
    i = models.CharField(max_length=40,null=False)
    j = models.CharField(max_length=40,null=False)
    k = models.CharField(max_length=40,null=False)
    l = models.CharField(max_length=40,null=False)
    m = models.CharField(max_length=40,null=False)
    n = models.CharField(max_length=40,null=False)
    o = models.CharField(max_length=40,null=False)
    p = models.CharField(max_length=40,null=False)
    q = models.CharField(max_length=40,null=False)
    r = models.CharField(max_length=40,null=False)
    s = models.CharField(max_length=40,null=False)
    t = models.CharField(max_length=40,null=False)
    u = models.CharField(max_length=40,null=False)
    v = models.CharField(max_length=40,null=False)
    w = models.CharField(max_length=40,null=False)
    x = models.CharField(max_length=40,null=False)
    y = models.CharField(max_length=40,null=False)
    z = models.CharField(max_length=40,null=False)

    class Meta:
        db_table = 'matrix_letters'
