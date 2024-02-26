from django.db import models


class Voting(models.Model):
    options = (
        ('Open', 'Open'),
        ('Closed', 'Closed'),
    )
    question = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=options, default='Open')

    def __str__(self):
        return self.question
