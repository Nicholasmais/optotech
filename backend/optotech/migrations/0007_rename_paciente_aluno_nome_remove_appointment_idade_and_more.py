# Generated by Django 4.2.5 on 2023-11-01 01:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('optotech', '0006_aluno'),
    ]

    operations = [
        migrations.RenameField(
            model_name='aluno',
            old_name='paciente',
            new_name='nome',
        ),
        migrations.RemoveField(
            model_name='appointment',
            name='idade',
        ),
        migrations.RemoveField(
            model_name='appointment',
            name='paciente',
        ),
        migrations.AddField(
            model_name='appointment',
            name='aluno',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.PROTECT, to='optotech.aluno'),
            preserve_default=False,
        ),
    ]
