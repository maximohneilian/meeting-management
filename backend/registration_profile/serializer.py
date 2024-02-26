import string

from rest_framework import serializers

from .models import RegistrationProfile


def do_password_validation(serializer, password):
    if len(password) < 8:
        raise serializers.ValidationError("Password must be at least 8 characters long")
    if any(char in string.punctuation for char in password):
        raise serializers.ValidationError("Password must only consist of letters and numbers")
    if 'password_repeat' in serializer.initial_data and password != serializer.initial_data['password_repeat']:
        raise serializers.ValidationError("Passwords do not match")

    return password


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationProfile
        fields = ['email']


class RegistrationValidationSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(max_length=100, read_only=True)
    last_name = serializers.CharField(max_length=100, read_only=True)
    username = serializers.CharField(max_length=100, required=True)
    address = serializers.CharField(max_length=100, required=True)
    password = serializers.CharField(max_length=100, required=True, write_only=True)
    password_repeat = serializers.CharField(max_length=100, required=True, write_only=True)

    def validate_password(self, password):
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        if any(char in string.punctuation for char in password):
            raise serializers.ValidationError("Password must only consist of letters and numbers")
        if 'password_repeat' in self.initial_data and password != self.initial_data['password_repeat']:
            raise serializers.ValidationError("Passwords do not match")

        return password

    class Meta:
        model = RegistrationProfile
        fields = ['email', 'username', 'address', 'code', 'password', 'password_repeat', 'first_name', 'last_name']
        read_only_fields = ['email']


class PasswordResetSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationProfile
        fields = ['email']


class PasswordResetValidationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=100, required=True)
    password_repeat = serializers.CharField(max_length=100, required=True)

    def validate_password(self, password):
        return do_password_validation(self, password)

    class Meta:
        model = RegistrationProfile
        fields = ['email', 'code', 'password', 'password_repeat']
        read_only_fields = ['email']
