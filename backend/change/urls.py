from django.urls import path

from change.views import ListChangesForMeeting

urlpatterns = [
    path('meeting/<int:meeting_id>/', ListChangesForMeeting.as_view()),
]
