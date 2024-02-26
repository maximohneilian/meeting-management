from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from django.db import models

User = get_user_model()


def files_path(instance, filename):
    return f"{instance.meeting.title}/files/{filename}"


class Meeting(models.Model):
    title = models.CharField(max_length=200)
    start_time = models.DateTimeField()
    duration = models.IntegerField(default=60)
    location = models.CharField(max_length=200, blank=True)
    meeting_url = models.URLField(max_length=200, blank=True)
    description = models.TextField(max_length=250, blank=True)
    meeting_reminders = ArrayField(models.IntegerField(default=15), blank=True, default=list)
    template = models.BooleanField(default=False)
    author = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='meetings')

    def __str__(self):
        return f'{self.title} at {self.start_time} in {self.location}'


class MeetingFiles(models.Model):
    meeting = models.ForeignKey(Meeting, related_name='meeting_files', on_delete=models.CASCADE)
    file = models.FileField(upload_to=files_path, null=True, blank=True)
