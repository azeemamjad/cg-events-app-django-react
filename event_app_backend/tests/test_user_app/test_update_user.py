import pytest
from rest_framework import status

@pytest.mark.django_db
def test_update_user(client, user, token):
    url = f'http://localhost:8000/api/user/update/'
    response =client.put(url, {"username": "Ali", "password": "qw", 'email': "admin@gmail.com"}, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['detail'] == 'User updated successfully'
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_update_user_without_token(client, user):
    url = f'http://localhost:8000/api/user/update/'
    response =client.put(url, {"username": "Ali", "password": "qw", 'email': "admin@gmail.com"})
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_update_user_with_invalid_token(client, user, token):
    url = f'http://localhost:8000/api/user/update/'
    response =client.put(url, {"username": "Ali", "password": "qw", 'email': "admin@gmail.com"}, headers={"Authorization": f"Bearer {token.replace('a', 'b')}"})
    assert response.json()['code'] == 'token_not_valid'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_update_user_with_missing_body(client, user, token):
    url = f'http://localhost:8000/api/user/update/'
    response = client.put(url, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['detail'] == 'User updated successfully'
    assert response.status_code == status.HTTP_200_OK