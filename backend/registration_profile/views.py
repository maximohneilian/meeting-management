import random
import string

from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from rest_framework import serializers, status
from rest_framework.generics import CreateAPIView, GenericAPIView, get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from registration_profile.models import RegistrationProfile
from registration_profile.serializer import RegistrationSerializer, RegistrationValidationSerializer, \
    PasswordResetSerializer, PasswordResetValidationSerializer

User = get_user_model()


def generate_code():
    letters = string.ascii_lowercase + string.ascii_uppercase + string.digits
    return ''.join([random.choice(letters) for i in range(10)])


# Create your views here.
class CreateRegistrationProfileAPIView(CreateAPIView):
    serializer_class = RegistrationSerializer
    queryset = RegistrationProfile.objects.all()
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        code = generate_code()
        serializer.save(code=code)
        send_mail(
            'Cannabees - Registration code',
            f"""Thank you for your registration!
            Your code is {code}""",
            'registration@cannabees.com',
            [serializer.validated_data['email']],
            fail_silently=False,
        )


class RegistrationValidationAPIView(GenericAPIView):
    serializer_class = RegistrationValidationSerializer
    permission_classes = [AllowAny]
    queryset = RegistrationProfile.objects.all()

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        registration_profile = get_object_or_404(RegistrationProfile, pk=request.data['email'])
        serializer.is_valid(raise_exception=True)
        if not serializer.validated_data['code'] == registration_profile.code:
            raise serializers.ValidationError("Registration code is not correct")

        user = User.objects.create(email=registration_profile.email,
                                   address=serializer.validated_data['address'],
                                   username=serializer.validated_data['username'])
        if serializer.validated_data.get('first_name'):
            user.set_first_name(serializer.validated_data['first_name'])
        if serializer.validated_data.get('last_name'):
            user.set_last_name(serializer.validated_data['last_name'])
        user.set_password(serializer.validated_data['password'])
        user.save()

        # Update the RegistrationProfile instance with the newly created User
        registration_profile.user = user
        registration_profile.save()

        return Response(serializer.data)


class PasswordResetAPIView(GenericAPIView):
    """By providing the users email address, he will then receive a code per email to reset his password."""

    serializer_class = PasswordResetSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        registration_profile = get_object_or_404(RegistrationProfile, email=email)
        code = generate_code()
        registration_profile.code = code
        registration_profile.save()
        send_mail(
            'Cannabees - Password Reset',
            f"""The code to reset your password is: {code}""",
            'registration@cannabees.com',
            [email],
            fail_silently=False,
        )

        return Response(self.get_serializer(registration_profile).data, status=status.HTTP_201_CREATED)


class PasswordResetValidationAPIView(GenericAPIView):
    serializer_class = PasswordResetValidationSerializer
    permission_classes = [AllowAny]
    queryset = RegistrationProfile.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = request.data.get('email')
        registration_profile = get_object_or_404(RegistrationProfile, email=email)

        if not serializer.validated_data.get('code') == registration_profile.code:
            raise serializers.ValidationError("Reset code is not correct")

        user = get_object_or_404(User, registration_profile=registration_profile)
        user.set_password(serializer.validated_data['password'])
        user.save()

        return Response(status=status.HTTP_201_CREATED)
