from celery import shared_task
from meeting.models import Meeting
from meeting_invite.models import MeetingInvite
from project.views import send_meeting_notification_email


@shared_task
def send_email_async(invite_id, meeting_id, ics_content):
    invite = MeetingInvite.objects.get(id=invite_id)
    meeting = Meeting.objects.get(id=meeting_id)
    invitee_email = invite.invitee.email
    try:
        send_meeting_notification_email(meeting, invitee_email, ics_content=ics_content)
    except Exception as e:
        print(f"Error sending email to {invitee_email}: {e}")
