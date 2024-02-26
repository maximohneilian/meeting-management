from django.contrib.auth import get_user_model
from django.db import models

from meeting.models import Meeting

User = get_user_model()


class Change(models.Model):
    text_content = models.CharField(max_length=100)
    time = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='changes')
    meeting = models.ForeignKey(to=Meeting, on_delete=models.CASCADE, related_name='changes')

    def __str__(self):
        return f'{self.user} made the following changes to {self.meeting}: {self.text_content}'
