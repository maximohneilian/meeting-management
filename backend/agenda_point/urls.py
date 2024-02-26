from django.urls import path

from agenda_point.views import RetrieveUpdateDeleteAgendaPointAPIView, CreateAgendaPointAPIView, \
    ListAgendaPointsByMeetingAPIView, GetVotingByAgendaPointAPIView, UpdateDeleteVotingAPIView, CreateVotingWithOptions

urlpatterns = [
    path('<int:id>/', RetrieveUpdateDeleteAgendaPointAPIView.as_view()),
    path('new/<int:meeting_id>/', CreateAgendaPointAPIView.as_view()),
    path('meeting/<int:meeting_id>/', ListAgendaPointsByMeetingAPIView.as_view()),
    path('<int:agenda_point_id>/voting/', GetVotingByAgendaPointAPIView.as_view()),
    path('voting/<int:id>/', UpdateDeleteVotingAPIView.as_view()),
    path('voting/new/<int:agenda_point_id>/', CreateVotingWithOptions.as_view()),
]
