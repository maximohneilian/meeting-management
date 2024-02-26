from rest_framework.generics import ListAPIView

from change.models import Change
from change.serializer import ChangeSerializer


class ListChangesForMeeting(ListAPIView):
    serializer_class = ChangeSerializer

    def get_queryset(self):
        return Change.objects.filter(meeting__id=self.kwargs['meeting_id'])
