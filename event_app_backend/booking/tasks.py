import time

from celery import shared_task

from event_management_app.models import Event
from user_app.models import AppUser
from .models import Booking
@shared_task
def create_booking_task(event_id, user_id, seat_no):
    event = Event.objects.get(id=event_id)
    user = AppUser.objects.get(id=user_id)
    booking = Booking.objects.create(event=event, user=user, seat_no=seat_no)
    booking.save()
    return "Booking Created!"