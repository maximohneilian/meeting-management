# Register your models here.
from django.contrib import admin

from .models import RegistrationProfile


class RegistrationProfileAdmin(admin.ModelAdmin):
    list_display = ['email', 'code']


admin.site.register(RegistrationProfile, RegistrationProfileAdmin)
