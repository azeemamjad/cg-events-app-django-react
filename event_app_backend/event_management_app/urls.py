from django.urls import path, include
from .views import index, HallCreateView, HallUpdateView, HallRetrieveView, HallDestroyView, HallViewSet
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'hall', HallViewSet)

urlpatterns = [
    # path('', index, name='index-view-temp'), # temporary route for checking app
    path('', include(router.urls)),
    path('create/hall/',HallCreateView.as_view(), name='hall-create-view'),
    path('update/hall/', HallUpdateView.as_view(), name='hall-update-view'),
    path('get/hall', HallRetrieveView.as_view(), name='hall-retrieve-view'),
    path('delete/hall', HallDestroyView.as_view(), name='hall-delete-view'),
]