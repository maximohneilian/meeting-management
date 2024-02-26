from django.db import models

from meeting.models import Meeting
from voting.models import Voting


def agenda_files_path(instance, filename):
    return f"{instance.agenda_point.title}/agenda-files/{filename}"


class AgendaPoint(models.Model):
    title = models.CharField(max_length=100)
    duration = models.IntegerField()
    description = models.TextField(max_length=1000, blank=True)
    notes = models.TextField(max_length=1000, blank=True)
    order = models.IntegerField()
    meeting = models.ForeignKey(to=Meeting, on_delete=models.CASCADE, related_name='agenda_points')
    voting = models.OneToOneField(to=Voting, on_delete=models.SET_NULL, related_name='agenda_point', blank=True,
                                  null=True)

    def __str__(self):
        return self.title


class AgendaFile(models.Model):
    agenda_point = models.ForeignKey(AgendaPoint, related_name='agenda_files', on_delete=models.CASCADE)
    file = models.FileField(upload_to=agenda_files_path)
