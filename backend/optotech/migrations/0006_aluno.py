# Generated by Django 4.2.5 on 2023-10-29 00:50

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('optotech', '0005_alter_matrixletter_a_alter_matrixletter_b_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Aluno',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('codigo', models.CharField(default=None, max_length=40)),
                ('paciente', models.CharField(max_length=40)),
                ('idade', models.IntegerField()),
            ],
            options={
                'db_table': 'alunos',
            },
        ),
    ]
