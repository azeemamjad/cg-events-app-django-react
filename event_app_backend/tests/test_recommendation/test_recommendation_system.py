import pytest
from rest_framework import status

@pytest.mark.django_db
def test_get_recommendations(client, event, event_2, token, booking):
    url = 'http://localhost:8000/api/event/recommend'
    response = client.get(url, headers={"Authorization": f"Bearer {token}"})
    assert response.json()[0]['title'] == event_2.title
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_get_recommendations_without_booking(client, event, event_2, token):
    url = 'http://localhost:8000/api/event/recommend'
    response = client.get(url, headers={"Authorization": f"Bearer {token}"})
    assert response.json() == []
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_get_recommendations_without_upcoming_events(client, event, token, booking):
    url = 'http://localhost:8000/api/event/recommend'
    response = client.get(url, headers={"Authorization": f"Bearer {token}"})
    assert response.json() == []
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_get_recommendations_without_booking(client, event, event_2, token):
    url = 'http://localhost:8000/api/event/recommend'
    response = client.get(url, headers={"Authorization": f"Bearer {token}"})
    assert response.json() == []
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_get_recommendations_without_token(client, event, event_2, booking):
    url = 'http://localhost:8000/api/event/recommend'
    response = client.get(url)
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_get_recommendations_with_invalid_token(client, event, event_2, token, booking):
    url = 'http://localhost:8000/api/event/recommend'
    response = client.get(url, headers={"Authorization": f"Bearer {token.replace('a', 'b')}"})
    assert response.json()['code'] == "token_not_valid"
    assert response.status_code == status.HTTP_401_UNAUTHORIZED