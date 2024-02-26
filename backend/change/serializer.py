from rest_framework import serializers

from change.models import Change
from meeting_invite.serializer import BasicUserSerializer


class ChangeSerializer(serializers.ModelSerializer):
    user = BasicUserSerializer(read_only=True)

    class Meta:
        model = Change
        fields = ['id', 'text_content', 'user', 'time']
