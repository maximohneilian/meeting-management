from django.db.models import Q
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from meeting.models import Meeting
from meeting.serializer import MeetingReminderSerializer
from .models import Reminder
from .serializer import ReminderSerializer


class CreateNewReminderAPIView(CreateAPIView):
    """Endpoint to create a new reminder."""
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserMeetingRemindersView(APIView):
    def get(self, request, *args, **kwargs):
        user_meetings = Meeting.objects.filter(Q(author=request.user) | Q(meeting_invites__invitee=request.user))
        reminders_list = []

        if user_meetings:
            for meeting in user_meetings:
                for time_before in meeting.meeting_reminders:
                    reminder_entry = {
                        'title': meeting.title,
                        'start_time': meeting.start_time,
                        'time_before': time_before
                    }
                    reminders_list.append(reminder_entry)

        serializer = MeetingReminderSerializer(reminders_list, many=True)
        return Response(serializer.data)
