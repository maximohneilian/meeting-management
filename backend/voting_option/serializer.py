from rest_framework import serializers
from .models import VotingOption


class VotingOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VotingOption
        fields = ['id', 'option', 'count']
