# Generated by Django 5.0.1 on 2024-02-20 15:56

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RegistrationProfile',
            fields=[
                ('email', models.EmailField(max_length=254, primary_key=True, serialize=False, unique=True)),
                ('code', models.CharField(blank=True, default='', max_length=20)),
            ],
        ),
    ]
