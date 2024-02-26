from django.contrib.auth import get_user_model
from rest_framework.generics import RetrieveUpdateDestroyAPIView, get_object_or_404, ListAPIView

from .serializer import UserSerializer

User = get_user_model()


class ListUsersAPIView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class RetrieveUpdateDeleteUsersAPIView(RetrieveUpdateDestroyAPIView):
    """Endpoint to retrieve update or delete the currently logged in user"""
    serializer_class = UserSerializer

    def get_object(self):
        user = self.request.user
        obj = get_object_or_404(User, id=user.id)
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_update(self, serializer):
        serializer.save()
        # email = self.request.user.email
        # send_mail(
        #     'Luna - Profile Update',
        #     'Congratulations! Your profile has been updated successfully.',
        #     'noreply@luna-project.com',
        #     [email],
        #     fail_silently=False
        # )
