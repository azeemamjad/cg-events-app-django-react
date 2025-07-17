from django.db import models
from django.contrib.auth.models import AbstractUser # Easy to manage JWT

class AppUser(AbstractUser):
    USER_TYPES = [
        ('normal', 'Normal'),
        ('broker', 'Broker')
    ]
    
    profile_picture = models.ImageField(blank=True, null=True)
    role = models.CharField(
        max_length=10,
        choices=USER_TYPES,
        default='broker'
    )
    # for verification purposes
    verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, default=False)


