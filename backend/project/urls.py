"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from .views import zoom_authentication, zoom_callback
from . import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

schema_view = get_schema_view(
    openapi.Info(
        title="Motion API",
        default_version='v1',
        description="API for social network assignment at Propulsion Academy",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="academy@constructor.org"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,  # Set to False restrict access to protected endpoints
    permission_classes=[permissions.AllowAny]  # Permissions for docs access
)

auth_patterns = [
    # path("password-reset/", PasswordResetAPIView.as_view()),
    # path("password-reset/validate/", PasswordResetValidationAPIView.as_view()),
    path("token/", TokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("token/verify/", TokenVerifyView.as_view()),
]

api_patterns = [
    path("admin/", admin.site.urls),
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('auth/', include(auth_patterns)),
    path('registration/', include('registration_profile.urls')),
    path('meetings/', include('meeting.urls')),
    path('meetings/invites/', include('meeting_invite.urls')),
    path('changes/', include('change.urls')),
    path('agenda-points/', include('agenda_point.urls')),
    path('comments/', include('comment.urls')),
    path('users/', include('user.urls')),
    path('reminders/', include('reminder.urls')),
    path('zoom-auth/', zoom_authentication, name='zoom_authentication'),
    path('redirect/', zoom_callback, name='zoom_callback'),
    # path('generate_ics/', GenerateICSView)
]

urlpatterns = [
    path("api/", include(api_patterns)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
