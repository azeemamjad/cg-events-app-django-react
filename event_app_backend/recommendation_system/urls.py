from django.urls import path, include
from .views import EventRecommendView

urlpatterns = [
    path('event/recommend', EventRecommendView.as_view(), name="event-recommend")
]