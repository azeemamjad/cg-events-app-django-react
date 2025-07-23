from django.db import models
from django.utils import timezone
from datetime import timedelta
from user_app.models import AppUser


def default_start_time():
    return timezone.now() + timedelta(days=1)


def default_end_time():
    return timezone.now() + timedelta(days=1, hours=3)


class Hall(models.Model):
    name = models.CharField(max_length=100)
    location = models.TextField()
    capacity = models.PositiveIntegerField(null=True, blank=True)
    verified = models.BooleanField(default=False)
    owner = models.ForeignKey(AppUser, related_name='halls', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name


class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    start_time = models.DateTimeField(default=default_start_time)
    end_time = models.DateTimeField(default=default_end_time)
    entry_fee = models.FloatField(null=False)
    genre = models.CharField(max_length=50)
    past_event = models.BooleanField(default=False)

    hall = models.ForeignKey(
        Hall,
        related_name='events',
        on_delete=models.SET_NULL,
        null=True
    )

    organizers = models.ManyToManyField(
        AppUser,
        related_name='organized_events'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class EventImage(models.Model):
    image = models.ImageField(upload_to='event_images/')
    title = models.CharField(max_length=100, null=True, blank=True)
    event = models.ForeignKey(
        Event,
        related_name='images',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.title or f"Image for {self.event.title}"
