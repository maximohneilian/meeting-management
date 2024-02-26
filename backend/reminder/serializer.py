from rest_framework import serializers

from meeting.models import Meeting
from user.serializer import UserSerializer
from .models import Reminder


class ReminderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    def validate_minutes_before(self, minutes_before):
        user = self.context['request'].user
        meeting_id = self.context['request'].data.get('meeting')
        meeting = Meeting.objects.filter(id=meeting_id).first()
        if user.reminders.filter(meeting=meeting, minutes_before=minutes_before).exists():
            raise serializers.ValidationError("There is already a reminder with the same timing for this meeting")

        return minutes_before

    class Meta:
        model = Reminder
        fields = ["id", "status", "user", "meeting", "minutes_before"]
        readOnlyFields = ["user", "status", ]

# class ListUserRemindersSerializer(serializers.ModelSerializer):
#     title = serializers.CharField(source='meeting.title')
#     start_time = serializers.DateTimeField(source='meeting.start_time')
#
#     class Meta:
#         model = Reminder
#         fields = ["id", "title", "start_time", "minutes_before"]
