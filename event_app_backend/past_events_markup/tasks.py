from celery import shared_task
from event_management_app.models import Event
from django.utils import timezone

@shared_task
def event_markup():
    past_events = Event.objects.filter(end_time__lt=timezone.now())
    for past_event in past_events:
        past_event.past_event = True
        past_event.save()
    return "Events Marked As Past Events"