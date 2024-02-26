from django.urls import path

from comment.views import CreateCommentAPIView, ListCommentsByMeetingAPIView, RetrieveUpdateDeleteCommentAPIView

urlpatterns = [
    path('new/<int:meeting_id>/', CreateCommentAPIView.as_view()),
    path('meeting/<int:meeting_id>/', ListCommentsByMeetingAPIView.as_view()),
    path('<int:id>/', RetrieveUpdateDeleteCommentAPIView.as_view()),
]
