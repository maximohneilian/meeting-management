from django.contrib.auth import get_user_model
from django.db.models import Q
from django.forms import model_to_dict
from django.utils.text import capfirst
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from change.models import Change
from meeting_invite.models import MeetingInvite
from project.tasks import send_email_async
from project.views import GenerateICSView
from .models import Meeting, MeetingFiles
from .serializer import MeetingSerializer, CreateMeetingSerializer

User = get_user_model()


class ListMyMeetingsAPIView(ListAPIView):
    """Endpoint to list meetings of the logged-in user."""
    serializer_class = MeetingSerializer

    def get_queryset(self):
        user = self.request.user
        return Meeting.objects.filter(
            Q(author=user) | Q(meeting_invites__invitee=self.request.user)).distinct().order_by(
            'start_time')


class RetrieveUpdateDeleteMeetingAPIView(RetrieveUpdateDestroyAPIView):
    """Endpoint to get, update and delete a meeting by ID."""
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_url_kwarg = 'id'

    def perform_update(self, serializer):
        instance = serializer.instance
        old_data = model_to_dict(instance)

        serializer.save()

        new_data = model_to_dict(instance)

        # Compare old and new data to identify changes
        for field_name, old_value in old_data.items():
            new_value = new_data.get(field_name)
            if old_value != new_value:
                # Create a Change instance for the modified field
                field_label = instance._meta.get_field(field_name).verbose_name
                change_text = f" changed {capfirst(field_label)}  from '{old_value}' to '{new_value}'"
                Change.objects.create(text_content=change_text, user=self.request.user, meeting=instance)


class CreateMeetingAPIView(CreateAPIView):
    """Endpoint to create a new meeting."""
    queryset = Meeting.objects.all()
    serializer_class = CreateMeetingSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        # Create the meeting object
        meeting = serializer.save(author=request.user)

        # Generate the .ics file content
        ics_view = GenerateICSView()
        response = ics_view.post(request)

        if response.status_code == status.HTTP_200_OK:
            ics_content = response.data
        else:
            return response

        # Handle image upload
        guests = request.data.getlist('guests')
        contributors = request.data.getlist('contributors')
        files = request.FILES.getlist('files')
        for guest in guests:
            guest = User.objects.get(id=guest)
            if guest:
                MeetingInvite.objects.create(meeting=meeting, invitee=guest)
        for contributor in contributors:
            contributor = User.objects.get(id=contributor)
            if contributor:
                MeetingInvite.objects.create(meeting=meeting, invitee=contributor, invitation_type="Contributor")
        for uploaded_file in files:
            MeetingFiles.objects.create(meeting=meeting, file=uploaded_file)

        # Send emails to invitees with the .ics file attached
        for invite in meeting.meeting_invites.all():
            send_email_async.delay(invite.id, meeting.id, ics_content)

        change_text = f" created the meeting '{meeting.title}'"
        Change.objects.create(text_content=change_text, user=request.user, meeting=meeting)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ListMeetingTemplatesAPIView(APIView):

    def get(self, request, *args, **kwargs):
        templates = Meeting.objects.filter(template=True)

        serializer = MeetingSerializer(templates, many=True)
        return Response(serializer.data)
