# Generated by Django 4.2.5 on 2023-11-02 14:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('optotech', '0009_remove_aluno_idade_aluno_data_nascimento'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='user',
            field=models.ForeignKey(default='4ce69dc0-28fa-49e7-927b-d3af60d95266', on_delete=django.db.models.deletion.PROTECT, to='optotech.user'),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='UserAppointments',
        ),
    ]
