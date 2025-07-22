from django.db import models

from event_management_app.models import Event
from user_app.models import AppUser


# Create your models here.
class Booking(models.Model):
    user = models.ForeignKey(AppUser, related_name="bookings",on_delete=models.CASCADE)
    event = models.ForeignKey(Event, related_name="bookings", on_delete=models.CASCADE)
    seat_no = models.IntegerField(null=False)