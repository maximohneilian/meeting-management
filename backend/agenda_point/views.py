from django.forms import model_to_dict
from django.utils.text import capfirst
from rest_framework import status
from rest_framework.generics import RetrieveUpdateDestroyAPIView, CreateAPIView, ListAPIView
from rest_framework.response import Response

from change.models import Change
from meeting.models import Meeting
from voting.models import Voting
from voting.serializer import VotingSerializer
from voting_option.models import VotingOption
from .models import AgendaPoint, AgendaFile
from .serializer import AgendaPointSerializer


class RetrieveUpdateDeleteAgendaPointAPIView(RetrieveUpdateDestroyAPIView):
    """Endpoint to get, update and delete an agenda point by ID."""
    queryset = AgendaPoint.objects.all()
    serializer_class = AgendaPointSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_url_kwarg = 'id'

    def perform_update(self, serializer):
        instance = serializer.instance
        old_data = model_to_dict(instance)

        serializer.save()

        new_data = model_to_dict(instance)

        for field_name, old_value in old_data.items():
            new_value = new_data.get(field_name)
            if old_value != new_value:
                field_label = instance._meta.get_field(field_name).verbose_name
                if old_value == '':
                    change_text = f" added the following {instance.title} agenda point {capfirst(field_label)}: '{new_value}'"
                else:
                    change_text = f" changed the {instance.title} agenda point {capfirst(field_label)}  from '{old_value}' to '{new_value}'"
                Change.objects.create(text_content=change_text, user=self.request.user, meeting=instance.meeting)
        # instance = serializer.instance
        # old_data = model_to_dict(instance)
        #
        # serializer.save()
        #
        # new_data = model_to_dict(instance)
        #
        # for field_name, old_value in old_data.items():
        #     new_value = new_data.get(field_name)
        #     if old_value != new_value:
        #         field_label = instance._meta.get_field(field_name).verbose_name
        #         change_text = f" changed the {instance.title} agenda point {capfirst(field_label)}  from '{old_value}' to '{new_value}'"
        #         Change.objects.create(text_content=change_text, user=self.request.user, meeting=instance.meeting)


class CreateAgendaPointAPIView(CreateAPIView):
    """Endpoint to create a new agenda point."""
    queryset = AgendaPoint.objects.all()
    serializer_class = AgendaPointSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        meeting_id = self.kwargs.get('meeting_id')
        meeting = Meeting.objects.get(pk=meeting_id)
        agenda_point = serializer.save(meeting=meeting)

        files = request.FILES.getlist('files')
        for uploaded_file in files:
            AgendaFile.objects.create(agenda_point=agenda_point, file=uploaded_file)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        title = serializer.data.get('title')

        change_text = f"{self.request.user} created the following agenda point: '{title}'"
        Change.objects.create(text_content=change_text, user=self.request.user, meeting=meeting)


class ListAgendaPointsByMeetingAPIView(ListAPIView):
    """Endpoint to get agenda points by meeting ID."""
    serializer_class = AgendaPointSerializer
    lookup_url_kwarg = 'meeting_id'

    # permission_classes = [AllowAny]

    def get_queryset(self):
        meeting_id = self.kwargs.get(self.lookup_url_kwarg)
        meeting = Meeting.objects.get(pk=meeting_id)
        return AgendaPoint.objects.filter(meeting=meeting)


class GetVotingByAgendaPointAPIView(ListAPIView):
    """Endpoint to get voting by agenda ID."""
    serializer_class = VotingSerializer

    def get_queryset(self):
        agenda_point_id = self.kwargs.get('agenda_point_id')
        agenda_point = AgendaPoint.objects.get(id=agenda_point_id)
        votings = Voting.objects.filter(agenda_point=agenda_point)
        return votings


class UpdateDeleteVotingAPIView(RetrieveUpdateDestroyAPIView):
    """Endpoint to get, update and delete a voting by ID."""
    queryset = Voting.objects.all()
    serializer_class = VotingSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_url_kwarg = 'id'

    def perform_update(self, serializer):
        serializer.save(partial=True)


class CreateVotingWithOptions(CreateAPIView):
    """Endpoint to create a new voting for agenda point."""
    serializer_class = VotingSerializer
    queryset = Voting.objects.all()

    def create(self, request, *args, **kwargs):
        agenda_point_id = self.kwargs.get('agenda_point_id')
        agenda_point = AgendaPoint.objects.get(pk=agenda_point_id)
        if agenda_point.voting is not None:
            return Response({"Error": "Voting already exists for this agenda point!"},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid()
        voting = serializer.save()
        options = request.data.getlist('options')
        for option in options:
            VotingOption.objects.create(voting=voting, option=option)

        agenda_point.voting = voting
        agenda_point.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
