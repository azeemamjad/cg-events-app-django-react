from celery import shared_task
from event_management_app.models import Event
from django.utils import timezone


@shared_task
def event_markup():
    past_events = Event.objects.filter(end_time__lt=timezone.now())
    for past_event in past_events:
        past_event.past_event = True
        past_event.save()
        # Access the related bookings of a single event instance
        if past_event.bookings.exists():
            past_bookings = past_event.bookings.all()
            for booking in past_bookings:
                booking.delete()
    return "Events Marked As Past Events"