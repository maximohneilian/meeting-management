from django.contrib.auth import get_user_model
from django.db import models

from meeting.models import Meeting

User = get_user_model()


class Comment(models.Model):
    content = models.TextField(max_length=100)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    meeting = models.ForeignKey(to=Meeting, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='comments')
    replies_to = models.OneToOneField(to='self', on_delete=models.CASCADE, related_name='reply', null=True, blank=True)

    def __str__(self):
        return f'{self.author} wrote the following comment: {self.content}'
