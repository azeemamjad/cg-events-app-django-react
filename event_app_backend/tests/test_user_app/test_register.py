import pytest
from rest_framework import status
from user_app.models import AppUser

@pytest.mark.django_db
def test_register_user(client):
    url = 'http://localhost:8000/api/user/register/'
    assert AppUser.objects.all().exists() == False
    response = client.post(url, {"username": "admin", 'email': 'admin@gmail.com', "password": "admin"})
    assert AppUser.objects.all().exists() == True
    assert response.json()['message'] == 'User registered successfully'
    assert response.status_code == status.HTTP_201_CREATED

@pytest.mark.django_db
def test_register_user_without_body(client):
    url = 'http://localhost:8000/api/user/register/'
    response = client.post(url)
    assert response.json()['username'][0] == response.json()['password'][0] == response.json()['email'][0] == 'This field is required.'
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_register_with_duplicates(client):
    url = 'http://localhost:8000/api/user/register/'
    client.post(url, {"username": "admin", 'email': 'admin@gmail.com', "password": "admin"})
    response = client.post(url, {"username": "admin", 'email': 'admin@gmail.com',"password": "admin"})
    assert response.json()['username'][0] == 'A user with that username already exists.'
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    
