import pytest
from rest_framework import status

@pytest.mark.django_db
def test_verify_access_token_health(client, token):
    url = 'http://localhost:8000/token_health/'
    response = client.post(url, {"token": token})
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_verify_access_token_health_without_body(client, token):
    url = 'http://localhost:8000/token_health/'
    response = client.post(url)
    assert response.json()['token'][0] == 'This field is required.'
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_verify_access_token_health_with_wrong_token(client, token):
    url = 'http://localhost:8000/token_health/'
    response = client.post(url, {"token": token.replace('a', 'b')})
    assert response.json()['code'] == 'token_not_valid'
    assert response.json()['detail'] == 'Token is invalid'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED