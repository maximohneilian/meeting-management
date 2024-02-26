import os
import urllib.parse
from datetime import datetime, timedelta

import requests
import requests.auth
from django.core.exceptions import ValidationError
from django.core.mail import EmailMessage
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import redirect
from ics import Calendar, Event
from pytz import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

CLIENT_ID = os.environ.get("CLIENT_ID")
CLIENT_SECRET = os.environ.get("CLIENT_SECRET")
REDIRECT_URI = os.environ.get("redirectURL")


def zoom_authentication(request):
    # Generate the authorization URL
    params = {
        "client_id": os.environ.get("CLIENT_ID"),
        "response_type": "code",
        "redirect_uri": os.environ.get("redirectURL")
    }
    authorization_url = "https://zoom.us/oauth/authorize?" + urllib.parse.urlencode(params)
    # return JsonResponse(redirect(authorization_url), safe=False)
    return redirect(authorization_url)
    # # Create the HTML form directly
    # html_content = f"""
    # <!DOCTYPE html>
    # <html lang="en">
    # <head>
    #     <meta charset="UTF-8">
    #     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    #     <title>Zoom Authentication</title>
    # </head>
    # <body>
    #     <a href="{authorization_url}" class="btn btn-primary">Create Meeting</a>
    # </body>
    # </html>
    # """
    # # Return the HTML content as an HTTP response
    # return HttpResponse(html_content)


# def make_authorization_url():
#     params = {
#         "client_id": os.environ.get("CLIENT_ID"),
#         "response_type": "code",
#         "redirect_uri": os.environ.get("redirectURL")
#     }
#     url = "https://zoom.us/oauth/authorize?" + urllib.parse.urlencode(params)
#     testvar = get_token('test')
#     return url


def zoom_callback(request):
    print(request.build_absolute_uri())
    error = request.GET.get('error', '')
    if error:
        return HttpResponse("Error: " + error)

    print('INSIDE ZOOM_CALLBACK')
    code = request.GET.get('code')
    print('Code parameter:', code)

    access_token = get_token(code)
    print('ACCESS TOKEN:')
    print(access_token)

    if access_token:
        request.session['access_token'] = access_token  # Store the access token in the session
        zoom_video_link = get_videolink(access_token)
        return JsonResponse({"zoom_video_link": zoom_video_link})
    else:
        return JsonResponse({"error": "Error retrieving access token"})


def get_token(code):
    print("INSIDE GET TOKEN")
    print('PRINTING CODE')
    print(code)
    client_auth = requests.auth.HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
    post_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI
    }

    response = requests.post("https://zoom.us/oauth/token",
                             auth=client_auth,
                             data=post_data)
    token_json = response.json()
    print("PRINTING JSON TOKEN")
    print(token_json)

    if 'access_token' in token_json:
        return token_json["access_token"]
    else:
        print(f"Error getting access token: {token_json}")
        return None


def get_videolink(access_token):
    headers = {"Authorization": "Bearer " + access_token}
    response = requests.get("https://api.zoom.us/v2/users/me/meetings", headers=headers)
    meetings_json = response.json()

    # Extract the join URLs from each meeting
    first_meeting = meetings_json.get("meetings", [])[0]
    if first_meeting:
        join_url = first_meeting.get("join_url")
        return join_url
    else:
        return None


class GenerateICSView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Extract data from the request
            title = request.data.get('title')
            start_time = datetime.strptime(request.data.get('start_time'), '%Y-%m-%dT%H:%M:%S.%fZ')
            duration = int(request.data.get('duration')) if request.data.get('duration') else 60
            location = request.data.get('location')
            description = request.data.get('description')

            # Convert start time to the user's timezone
            user_timezone = timezone('Europe/Berlin')
            start_time = user_timezone.localize(start_time)

            end_time = start_time + timedelta(minutes=duration)

            cal = Calendar()

            event = Event()
            event.name = title
            event.begin = start_time
            event.end = end_time
            event.location = location
            event.description = description

            cal.events.add(event)

            return Response(str(cal), status=status.HTTP_200_OK)

        except Exception as e:
            error_message = f"An error occurred: {e}"
            return Response({"error": error_message}, status=status.HTTP_400_BAD_REQUEST)


def send_meeting_notification_email(meeting, invitee_email, updated_fields=None, ics_content=None):
    # if updated_fields:
    #     subject = f"Update: {meeting.title}"
    #     message = f"The meeting '{meeting.title}' has been updated. Please check the changes.\n\n"
    #     message += "Updated Fields:\n"
    #     updated_fields_list = ", ".join(updated_fields)
    #     message += updated_fields_list
    #
    # else:
    subject = f"You've been invited to a new meeting: {meeting.title}"

    html_file_path = '/backend/project/meeting_notification_email/meeting_notification_email.html'
    print("Attempting to open HTML file at path:", html_file_path)

    try:
        with open(html_file_path, 'r') as file:
            html_content = file.read()

        start_time = meeting.start_time.strftime('%d-%m-%Y %H:%M')

        invitees = f'{", ".join([f"{invite.invitee.username} ({invite.invitee.email})"
                                 for invite in meeting.meeting_invites.all()])}'

        print("meeting Id: ", meeting.id)
        print("HTML Content Before Formatting:", html_content)

        html_content = html_content.format(meeting=meeting, invitees=invitees, start_time=start_time)

        print("HTML Content After Formatting:", html_content)

        email = EmailMessage(
            subject=subject,
            body=html_content,
            from_email="noreply@cannabees.com",
            to=[invitee_email],
        )

        if ics_content:
            email.attach('meeting.ics', ics_content, 'text/calendar')

        email.content_subtype = 'html'

        email.body = html_content

        email.send()

    except FileNotFoundError as e:
        print("FileNotFoundError:", e)

    except ValidationError as e:
        print("ValidationError:", e)

    except Exception as e:
        print("An error occurred while sending the email:", e)
