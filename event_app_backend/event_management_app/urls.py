from django.urls import path
from .views import index, HallCreateView, HallUpdateView, HallRetrieveView, HallDestroyView

urlpatterns = [
    path('', index, name='index-view-temp'), # temporary route for checking app
    path('create/hall/',HallCreateView.as_view(), name='hall-create-view'),
    path('update/hall/', HallUpdateView.as_view(), name='hall-update-view'),
    path('get/hall', HallRetrieveView.as_view(), name='hall-retrieve-view'),
    path('delete/hall', HallDestroyView.as_view(), name='hall-delete-view'),
]