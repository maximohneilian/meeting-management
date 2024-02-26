from django.urls import path

from .views import RetrieveUpdateDeleteUsersAPIView, ListUsersAPIView

urlpatterns = [
    path('me/', RetrieveUpdateDeleteUsersAPIView.as_view()),
    path("", ListUsersAPIView.as_view()),
]
