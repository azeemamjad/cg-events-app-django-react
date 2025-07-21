from django.urls import path, include
from .views import HallViewSet, EventViewSet
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'hall', HallViewSet)
router.register(r'event', EventViewSet)

urlpatterns = [
    # path('', index, name='index-view-temp'), # temporary route for checking app
    path('', include(router.urls)),
]