from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


# Create your models here.
class RegistrationProfile(models.Model):
    email = models.EmailField(unique=True, primary_key=True)
    code = models.CharField(max_length=20, blank=True, default='')
    user = models.OneToOneField(to=User, on_delete=models.CASCADE, related_name='registration_profile', blank=True,
                                null=True)
