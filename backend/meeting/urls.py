from django.urls import path

from meeting_invite.views import UpdateInviteeListAPIView
from reminder.views import UserMeetingRemindersView
from .views import ListMyMeetingsAPIView, RetrieveUpdateDeleteMeetingAPIView, CreateMeetingAPIView, \
    ListMeetingTemplatesAPIView

urlpatterns = [
    path('', ListMyMeetingsAPIView.as_view()),
    path('<int:id>/', RetrieveUpdateDeleteMeetingAPIView.as_view()),
    path('new/', CreateMeetingAPIView.as_view()),
    path('invites/<int:meeting_id>/', UpdateInviteeListAPIView.as_view()),
    path('reminders/', UserMeetingRemindersView.as_view()),
    path('templates/', ListMeetingTemplatesAPIView.as_view()),
]
