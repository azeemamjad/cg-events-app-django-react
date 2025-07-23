from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from .views import CustomTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/', include('user_app.urls')),
    path('api/', include('event_management_app.urls')),
    path('api/', include('booking.urls')),
    path('api/', include('reviews.urls')),
    path('api/', include('recommendation_system.urls')),
    path('login/', CustomTokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('token_health/', TokenVerifyView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)