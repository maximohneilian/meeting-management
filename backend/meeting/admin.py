from django.contrib import admin

from .models import Meeting, MeetingFiles

admin.site.register(Meeting)
admin.site.register(MeetingFiles)
