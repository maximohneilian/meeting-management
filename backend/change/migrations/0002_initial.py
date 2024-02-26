# Generated by Django 5.0.1 on 2024-02-20 15:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('change', '0001_initial'),
        ('meeting', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='change',
            name='meeting',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='changes', to='meeting.meeting'),
        ),
    ]