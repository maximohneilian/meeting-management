from django.db import models

from voting.models import Voting


class VotingOption(models.Model):
    option = models.CharField(max_length=100)
    count = models.IntegerField(default=0)
    voting = models.ForeignKey(to=Voting, on_delete=models.CASCADE, related_name='voting_options')

    def __str__(self):
        return self.option
