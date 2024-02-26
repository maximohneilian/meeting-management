from rest_framework import serializers

from agenda_point.serializer import AgendaPointSerializer
from comment.serializer import CommentSerializer
from meeting_invite.serializer import BasicUserSerializer
from .models import Meeting, MeetingFiles


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingFiles
        fields = ['id', 'file']


class MeetingReminderSerializer(serializers.Serializer):
    title = serializers.CharField()
    start_time = serializers.DateTimeField()
    time_before = serializers.IntegerField()


class MeetingSerializer(serializers.ModelSerializer):
    agenda_points = AgendaPointSerializer(many=True)
    comments = CommentSerializer(many=True)
    guests = serializers.SerializerMethodField(read_only=True)
    contributors = serializers.SerializerMethodField(read_only=True)
    meeting_files = FileSerializer(read_only=True, many=True)
    author = BasicUserSerializer()

    def get_guests(self, obj):
        # Filter meeting_invites for 'Guest' type and get the invitees
        from user.serializer import UserSerializer
        guest_invites = obj.meeting_invites.filter(invitation_type="Guest")
        guests_data = []

        for invite in guest_invites:
            guest = UserSerializer(invite.invitee).data
            # Append additional invite fields to the guest data
            guest['invite_id'] = invite.id
            guest['invite_status'] = invite.status
            guests_data.append(guest)

        return guests_data

    def get_contributors(self, obj):
        # Filter meeting_invites for 'Contributor' type and get the invitees
        from user.serializer import UserSerializer
        contributor_invites = obj.meeting_invites.filter(invitation_type="Contributor")
        contributors_data = []

        for invite in contributor_invites:
            contributor = UserSerializer(invite.invitee).data
            # Append additional invite fields to the guest data
            contributor['invite_id'] = invite.id
            contributor['invite_status'] = invite.status
            contributors_data.append(contributor)

        return contributors_data

    class Meta:
        model = Meeting
        fields = ['id', 'title', 'start_time', 'duration', 'location', 'meeting_url', 'description', 'meeting_files',
                  'template', 'author', 'agenda_points', 'comments', 'guests', 'contributors', 'meeting_reminders']


class CreateMeetingSerializer(serializers.ModelSerializer):
    guests = serializers.SerializerMethodField(read_only=True)
    contributors = serializers.SerializerMethodField(read_only=True)
    meeting_files = FileSerializer(read_only=True, many=True)

    def get_guests(self, obj):
        # Filter meeting_invites for 'Guest' type and get the invitees
        from user.serializer import UserSerializer
        guest_invites = obj.meeting_invites.filter(invitation_type="Guest")
        guests = [invite.invitee for invite in guest_invites]

        return UserSerializer(guests, many=True).data

    def get_contributors(self, obj):
        # Filter meeting_invites for 'Contributor' type and get the invitees
        from user.serializer import UserSerializer
        contributor_invites = obj.meeting_invites.filter(invitation_type="Contributor")
        contributors = [invite.invitee for invite in contributor_invites]

        return UserSerializer(contributors, many=True).data

    class Meta:
        model = Meeting
        fields = ['id', 'title', 'start_time', 'duration', 'location', 'meeting_url', 'description',
                  'meeting_files', 'template', 'meeting_reminders', 'guests', 'contributors']
