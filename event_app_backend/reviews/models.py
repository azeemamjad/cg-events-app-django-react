from random import choices

from django.db import models
from user_app.models import AppUser
from event_management_app.models import Event

class Review(models.Model):
    class RatingChoices(models.IntegerChoices):
        ONE = 1, '1'
        TWO = 2, '2'
        THREE = 3, '3'
        FOUR = 4, '4'
        FIVE = 5, '5'
    user = models.ForeignKey(AppUser, related_name="reviews", on_delete=models.CASCADE)
    event = models.ForeignKey(Event, related_name="reviews", on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    rating = models.IntegerField(choices=RatingChoices.choices)