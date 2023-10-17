# Generated by Django 4.2.5 on 2023-10-17 00:31

import django.contrib.postgres.fields
from django.db import migrations, models
import uuid

class Migration(migrations.Migration):

    dependencies = [
        ('optotech', '0003_rename_appointment_id_userappointments_appointment_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='MatrixLetter',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('a', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('b', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('c', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('d', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('e', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('f', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('g', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('h', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('i', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('j', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('k', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('l', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('m', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('n', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('o', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('p', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('q', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('r', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('s', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('t', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('u', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('v', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('w', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('x', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('y', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
                ('z', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=5)),
            ],
            options={
                'db_table': 'matrix_letters',
            },
        ),
    ]
