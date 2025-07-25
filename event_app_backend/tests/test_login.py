import pytest
from rest_framework import status


@pytest.mark.django_db
def test_login_user(client, user):
    url = 'http://localhost:8000/login/'
    response = client.post(url, {"username": user.username, "password": "admin"})
    assert response.json()['access']
    assert response.json()['refresh']
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_login_user_with_wrong_credential(client, user):
    url = 'http://localhost:8000/login/'
    response = client.post(url, {"username": user.username+'2', "password": "admin"})
    assert response.json()['detail'] == 'No active account found with the given credentials'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    response = client.post(url, {"username": user.username, "password": "admin12"})
    assert response.json()['detail'] == 'No active account found with the given credentials'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_login_user_without_credential(client):
    url = 'http://localhost:8000/login/'
    response = client.post(url, {})
    assert response.json()['username'][0] == response.json()['password'][0] == 'This field is required.'
    assert response.status_code == status.HTTP_400_BAD_REQUEST