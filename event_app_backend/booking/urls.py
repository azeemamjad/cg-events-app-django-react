from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookingViewSet

router = DefaultRouter()
router.register(r'booking', BookingViewSet)

urlpatterns = [
    path('', include(router.urls))
]