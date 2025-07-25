import pytest
from rest_framework import status

@pytest.mark.django_db
def test_getme_user(client, token, user):
    url = 'http://localhost.com:8000/api/user/getme/'
    response = client.get(url, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['username'] == user.username
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_getme_user_without_token(client, user):
    url = 'http://localhost.com:8000/api/user/getme/'
    response = client.get(url)
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_getme_user_with_invalid_token(client, token, user):
    url = 'http://localhost.com:8000/api/user/getme/'
    response = client.get(url, headers={"Authorization": f"Bearer {token.replace('a', 'b')}"})
    assert response.json()['code'] == 'token_not_valid'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED