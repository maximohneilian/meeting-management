from django.contrib.auth import get_user_model
from rest_framework import serializers

from meeting.models import Meeting
from .models import MeetingInvite

User = get_user_model()


class BasicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'profile_picture', 'first_name', 'last_name']


class BasicMeetingSerializer(serializers.ModelSerializer):
    author = BasicUserSerializer(read_only=True)

    class Meta:
        model = Meeting
        fields = ['id', 'title', 'start_time', 'author']


class MeetingInviteSerializer(serializers.ModelSerializer):
    invitee = BasicUserSerializer(read_only=True)
    meeting = BasicMeetingSerializer(read_only=True)

    class Meta:
        model = MeetingInvite
        fields = ['id', 'meeting', 'invitation_type', 'invitee', 'status']


class CreateMeetingInviteSerializer(serializers.ModelSerializer):
    invitee = BasicUserSerializer(read_only=True)

    class Meta:
        model = MeetingInvite
        fields = ['invitation_type', 'invitee']
