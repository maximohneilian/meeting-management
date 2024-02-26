from rest_framework import serializers

from agenda_point.models import AgendaPoint, AgendaFile
from meeting_invite.serializer import BasicMeetingSerializer
from voting.serializer import VotingSerializer


class AgendaFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgendaFile
        fields = ['id', 'file']


class AgendaPointSerializer(serializers.ModelSerializer):
    meeting = BasicMeetingSerializer(read_only=True)
    voting = VotingSerializer(required=False)
    agenda_files = AgendaFileSerializer(many=True, read_only=True)

    class Meta:
        model = AgendaPoint
        fields = ['id', 'title', 'duration', 'description', 'notes', 'agenda_files', 'order', 'meeting', 'voting']
