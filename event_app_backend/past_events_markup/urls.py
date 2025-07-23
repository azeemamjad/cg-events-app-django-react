from django.urls import path
from .views import schedule_event_markup

urlpatterns = [
    path('schedule-event-markup/', schedule_event_markup, name='schedule')
]