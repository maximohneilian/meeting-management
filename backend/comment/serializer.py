from rest_framework import serializers

from agenda_point.serializer import BasicMeetingSerializer
from user.serializer import UserSerializer
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    meeting = BasicMeetingSerializer(read_only=True)
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'content', 'date_created', 'date_modified', 'meeting', 'author', 'replies_to')
        read_only_fields = ['date_created', 'date_modified']
