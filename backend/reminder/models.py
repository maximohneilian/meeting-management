from django.contrib.auth import get_user_model
from django.db import models

from meeting.models import Meeting

User = get_user_model()


class Reminder(models.Model):
    status_choices = (
        ('P', 'Pending'),
        ('D', 'Dismissed'),
    )

    status = models.CharField(max_length=100, choices=status_choices, default='P')
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='reminders')
    meeting = models.ForeignKey(to=Meeting, on_delete=models.CASCADE)
    minutes_before = models.IntegerField(default=15)

    def __str__(self):
        return f"Reminder {self.minutes_before} minute before meeting {str(self.meeting)}"
