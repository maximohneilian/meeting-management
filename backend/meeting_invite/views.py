from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.generics import UpdateAPIView, ListAPIView
from rest_framework.response import Response

from change.models import Change
from meeting.models import Meeting
from meeting.serializer import MeetingSerializer
from meeting_invite.models import MeetingInvite
from meeting_invite.serializer import MeetingInviteSerializer

User = get_user_model()


class ListMeetingInvitesAPIView(ListAPIView):
    serializer_class = MeetingInviteSerializer

    def get_queryset(self):
        return MeetingInvite.objects.filter(invitee=self.request.user)


class AcceptMeetingInviteAPIView(UpdateAPIView):
    serializer_class = MeetingInviteSerializer
    queryset = MeetingInvite.objects.all()
    lookup_url_kwarg = 'invite_id'

    def perform_update(self, serializer):
        invite_instance = self.get_object()

        serializer.save(status="A", partial=True)

        # Create a new Change instance
        Change.objects.create(
            text_content=" accepted the meeting invite.",
            user=self.request.user,
            meeting=invite_instance.meeting
        )


class RejectMeetingInviteAPIView(UpdateAPIView):
    serializer_class = MeetingInviteSerializer
    queryset = MeetingInvite.objects.all()
    lookup_url_kwarg = 'invite_id'

    def perform_update(self, serializer):
        invite_instance = self.get_object()

        serializer.save(status="R", partial=True)

        # Create a new Change instance
        Change.objects.create(
            text_content=" rejected the meeting invite.",
            user=self.request.user,
            meeting=invite_instance.meeting
        )


class UpdateInviteeListAPIView(UpdateAPIView):
    """Endpoint to update the invitee list for a meeting."""
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer

    def _sort_invitees_into_groups(self, request_data, meeting):
        def get_user(id):
            return User.objects.get(pk=id)

        new_guests = {get_user(id) for id in request_data.getlist('guests')}
        new_contributors = {get_user(id) for id in request_data.getlist('contributors')}
        old_invites = {get_user(invite.invitee.id) for invite in meeting.meeting_invites.all()}
        old_guests = {get_user(invite.invitee.id) for invite in meeting.meeting_invites.all() if
                      invite.invitation_type == 'Guest'}
        old_contributors = {get_user(invite.invitee.id) for invite in meeting.meeting_invites.all() if
                            invite.invitation_type == 'Contributor'}

        to_uninvite = old_invites - new_guests - new_contributors
        to_invite_guest = new_guests - old_invites
        to_invite_contributor = new_contributors - old_invites
        to_change_to_guest = {user for user in new_guests if user in old_contributors}
        to_change_to_contributor = {user for user in new_contributors if user in old_guests}

        return to_invite_guest, to_invite_contributor, to_change_to_guest, to_change_to_contributor, to_uninvite

    def patch(self, request, *args, **kwargs):
        meeting_id = self.kwargs.get('meeting_id')
        meeting = Meeting.objects.get(pk=meeting_id)

        to_invite_guest, to_invite_contributor, to_change_to_guest, to_change_to_contributor, to_uninvite = \
            self._sort_invitees_into_groups(request.data, meeting)

        for user in to_invite_guest:
            MeetingInvite.objects.create(meeting=meeting, invitation_type="Guest", invitee=user)

        for user in to_invite_contributor:
            MeetingInvite.objects.create(meeting=meeting, invitation_type="Contributor", invitee=user)

        MeetingInvite.objects.filter(invitee__in=to_change_to_guest).update(invitation_type="Guest")
        MeetingInvite.objects.filter(invitee__in=to_change_to_contributor).update(invitation_type="Contributor")
        MeetingInvite.objects.filter(invitee__in=to_uninvite).delete()

        return Response('Invitees list updated successfully', status=status.HTTP_200_OK)
