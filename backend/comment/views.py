from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView

from meeting.models import Meeting
from .models import Comment
from .serializer import CommentSerializer


class CreateCommentAPIView(CreateAPIView):
    """Endpoint to create a new comment."""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        meeting_id = self.kwargs.get('meeting_id')
        meeting = Meeting.objects.get(pk=meeting_id)
        serializer.save(meeting=meeting, author=self.request.user)


class ListCommentsByMeetingAPIView(ListAPIView):
    """Endpoint to get comments by meeting ID."""
    serializer_class = CommentSerializer
    lookup_url_kwarg = 'meeting_id'

    # permission_classes = [AllowAny]

    def get_queryset(self):
        meeting_id = self.kwargs.get(self.lookup_url_kwarg)
        meeting = Meeting.objects.get(pk=meeting_id)
        return Comment.objects.filter(meeting=meeting)


class RetrieveUpdateDeleteCommentAPIView(RetrieveUpdateDestroyAPIView):
    """Endpoint to get, update and delete a comment by ID."""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_url_kwarg = 'id'

    def perform_update(self, serializer):
        serializer.save(partial=True)
