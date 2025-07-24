import pytest
from rest_framework.test import APIClient

from user_app.models import AppUser

from event_management_app.models import Hall

@pytest.fixture
def client():
    return APIClient()

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
def token(client, user):
    response = client.post('http://localhost:8000/login/',{'username': user.username, "password": "admin"})
    return response.json()['access']

@pytest.fixture
def hall(user):
    hall = Hall.objects.create(
        name='Mall 1',
        location='Lahore',
        capacity=20,
        owner=user
    )
    hall.save()
    return hall