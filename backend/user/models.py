from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
def profile_picture_path(instance, filename):
    return f"{instance.username}/profile-pictures/{filename}"


# Create your models here.
class User(AbstractUser):
    # Field used for authentication
    USERNAME_FIELD = 'email'

    # Additional fields required when using createsuperuser (USERNAME_FIELD and passwords are always required)
    REQUIRED_FIELDS = ['username']

    first_name = models.CharField(max_length=200, blank=True)
    last_name = models.CharField(max_length=200, blank=True)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=200, unique=True)
    phone = models.CharField(max_length=200, blank=True, default='')
    profile_picture = models.ImageField(upload_to=profile_picture_path, blank=True, null=True)
    address = models.CharField(max_length=200, blank=True)
    about_me = models.TextField(blank=True)
    joined_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
