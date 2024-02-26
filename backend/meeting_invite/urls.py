from django.urls import path

from meeting_invite.views import AcceptMeetingInviteAPIView, RejectMeetingInviteAPIView, ListMeetingInvitesAPIView

urlpatterns = [
    path('', ListMeetingInvitesAPIView.as_view()),
    path('accept/<int:invite_id>/', AcceptMeetingInviteAPIView.as_view()),
    path('reject/<int:invite_id>/', RejectMeetingInviteAPIView.as_view()),
]
