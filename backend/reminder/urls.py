from django.urls import path

from .views import CreateNewReminderAPIView

urlpatterns = [
    path('new/', CreateNewReminderAPIView.as_view()),
]
