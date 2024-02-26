from django.urls import path

from .views import CreateRegistrationProfileAPIView, RegistrationValidationAPIView

urlpatterns = [
    path('', CreateRegistrationProfileAPIView.as_view()),
    path('validate/', RegistrationValidationAPIView.as_view()),
]
