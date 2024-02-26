from rest_framework import serializers

from voting_option.serializer import VotingOptionSerializer
from .models import Voting


class VotingSerializer(serializers.ModelSerializer):
    voting_options = VotingOptionSerializer(many=True, required=False)

    class Meta:
        model = Voting
        fields = ['id', 'question', 'voting_options']
