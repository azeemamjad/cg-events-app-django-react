import pytest
from rest_framework import status


@pytest.mark.django_db
def test_refresh_token(client, refresh):
    url = 'http://localhost:8000/refresh/'
    response = client.post(url, {"refresh": refresh})
    assert response.json()['access']
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_refresh_token_without_body(client, refresh):
    url = 'http://localhost:8000/refresh/'
    response = client.post(url)
    assert response.json()['refresh'][0] == 'This field is required.'
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_refresh_token_with_wrong_token(client, refresh):
    url = 'http://localhost:8000/refresh/'
    response = client.post(url, {"refresh": refresh.replace("a", "b")})
    assert response.json()['code'] == 'token_not_valid'
    assert response.json()['detail'] == 'Token is invalid'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED