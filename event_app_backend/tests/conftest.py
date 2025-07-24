import pytest
from django.template.defaultfilters import title
from rest_framework.test import APIClient

from user_app.models import AppUser

from event_management_app.models import Hall
from event_management_app.models import Event

# Global
@pytest.fixture
def client():
    return APIClient()

# User & Authentication Related
@pytest.fixture
def user():
    user = AppUser.objects.create(
        username='admin',
        is_active=True,
        verified=True
    )
    user.set_password('admin')
    user.save()
    return user

@pytest.fixture
def user2():
    user = AppUser.objects.create(
        username='admin1',
        is_active=True,
        verified=True
    )
    user.set_password('admin')
    user.save()
    return user

@pytest.fixture
def token(client, user):
    response = client.post('http://localhost:8000/login/',{'username': user.username, "password": "admin"})
    return response.json()['access']

# Hall Related
@pytest.fixture
def hall(user):
    hall_object = Hall.objects.create(
        name='Mall 1',
        location='Lahore',
        capacity=20,
        owner=user
    )
    hall_object.save()
    return hall_object

@pytest.fixture
def hall2(user):
    hall_object = Hall.objects.create(
        name='Mall 2',
        location='Karachi',
        capacity=31,
        owner=user
    )
    hall_object.save()
    return hall_object

# Event Related
@pytest.fixture
def event(hall, user):
    event_object = Event.objects.create(
        title="Little Sports Gala",
        description="Hello This is Special One!",
        genre='Sports',
        entry_fee=1340,
        hall=hall,
    )
    event_object.organizers.set([user])
    event_object.save()
    return event_object