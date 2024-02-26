from django.contrib.auth import get_user_model
from django.db import models

from meeting.models import Meeting

User = get_user_model()


class MeetingInvite(models.Model):
    types = (
        ('Contributor', 'Contributor'),
        ('Guest', 'Guest'),
    )
    status_choices = (
        ('P', 'Pending'),
        ('A', 'Accepted'),
        ('R', 'Rejected'),
    )

    invitation_type = models.CharField(max_length=20, choices=types, default="Guest")
    meeting = models.ForeignKey(to=Meeting, on_delete=models.CASCADE, related_name='meeting_invites')
    invitee = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='meeting_invites')
    status = models.CharField(max_length=20, choices=status_choices, default='Pending')
