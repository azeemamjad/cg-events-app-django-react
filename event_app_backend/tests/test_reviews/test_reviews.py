import pytest
from rest_framework import status

@pytest.mark.django_db
def test_create_review(client, booking, token, event):
    url = 'http://localhost:8000/api/review/'
    response = client.post(url, {'title': 'good event', 'description': 'Enjoyed a lot', 'rating': 5, 'event': event.id}, headers={'Authorization': f"Bearer {token}"})
    assert response.json()['title'] == 'good event'
    assert response.status_code == status.HTTP_201_CREATED

@pytest.mark.django_db
def test_create_review_twice(client, booking, token, event):
    url = 'http://localhost:8000/api/review/'
    response = client.post(url, {'title': 'good event', 'description': 'Enjoyed a lot', 'rating': 5, 'event': event.id}, headers={'Authorization': f"Bearer {token}"})
    response = client.post(url, {'title': 'good event', 'description': 'Enjoyed a lot', 'rating': 5, 'event': event.id}, headers={'Authorization': f"Bearer {token}"})
    assert response.json()['event'][0] == "You Can't Review a Single Event Twice!"
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_create_review_without_booking(client, token, event):
    url = 'http://localhost:8000/api/review/'
    response = client.post(url, {'title': 'good event', 'description': 'Enjoyed a lot', 'rating': 5, 'event': event.id}, headers={'Authorization': f"Bearer {token}"})
    assert response.json()['event'][0] == "You don't have any bookings in this event!"
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_create_review_without_token(client, booking, event):
    url = 'http://localhost:8000/api/review/'
    response = client.post(url, {'title': 'good event', 'description': 'Enjoyed a lot', 'rating': 5, 'event': event.id})
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_create_review_with_invalid_token(client, booking, token, event):
    url = 'http://localhost:8000/api/review/'
    response = client.post(url, {'title': 'good event', 'description': 'Enjoyed a lot', 'rating': 5, 'event': event.id}, headers={'Authorization': f"Bearer {token.replace('a', 'b')}"})
    assert response.json()['code'] == "token_not_valid"
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_update_review(client, review, event, token):
    url = f'http://localhost:8000/api/review/{review.id}/'
    response = client.put(url, {'title': 'good event', 'description': 'Enjoyed a lot', 'rating': 5, 'event': event.id}, headers={'Authorization': f"Bearer {token}"})
    assert response.json()['title'] == 'good event'
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_update_review_with_invalid_rating(client, review, event, token):
    url = f'http://localhost:8000/api/review/{review.id}/'
    response = client.put(url, {'title': 'good event', 'description': 'Enjoyed a lot', 'rating': 6, 'event': event.id}, headers={'Authorization': f"Bearer {token}"})
    assert response.json()['rating'][0] == '"6" is not a valid choice.'
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_update_review_with_no_body(client, review, event, token):
    url = f'http://localhost:8000/api/review/{review.id}/'
    response = client.put(url, headers={'Authorization': f"Bearer {token}"})
    assert response.json()['title'][0] == response.json()['description'][0] == response.json()['rating'][0] == response.json()['event'][0] == 'This field is required.'
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_update_review_with_missing_fields(client, review, event, token):
    url = f'http://localhost:8000/api/review/{review.id}/'
    response = client.put(url, {'title': 'good event', 'rating': 5, 'event': event.id}, headers={'Authorization': f"Bearer {token}"})
    assert response.json()['description'][0] == 'This field is required.'
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_update_review_without_token(client, review, event):
    url = f'http://localhost:8000/api/review/{review.id}/'
    response = client.put(url, {'title': 'good event', 'description': 'Enjoyed a lot', 'rating': 5, 'event': event.id})
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_update_review_without_invalid_token(client, review, event, token):
    url = f'http://localhost:8000/api/review/{review.id}/'
    response = client.put(url, {'title': 'good event', 'description': 'Enjoyed a lot', 'rating': 5, 'event': event.id}, headers={'Authorization': f"Bearer {token.replace('a', 'b')}"})
    assert response.json()['code'] == "token_not_valid"
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_update_review_with_partial_fields(client, review, event, token):
    url = f'http://localhost:8000/api/review/{review.id}/'
    response = client.patch(url, {'title': 'good event'}, headers={'Authorization': f"Bearer {token}"})
    assert response.json()['title'] == 'good event'
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_update_review_with_partial_fields_without_token(client, review, event):
    url = f'http://localhost:8000/api/review/{review.id}/'
    response = client.patch(url, {'title': 'good event'})
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_update_review_with_partial_fields_with_invalid_token(client, review, event, token):
    url = f'http://localhost:8000/api/review/{review.id}/'
    response = client.patch(url, {'title': 'good event'}, headers={'Authorization': f"Bearer {token.replace('a', 'b')}"})
    assert response.json()['code'] == "token_not_valid"
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_delete_review(client, review, token):
    url = f'http://localhost:8000/api/review/{review.id}/'
    response = client.delete(url, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_204_NO_CONTENT

@pytest.mark.django_db
def test_delete_invalid_review(client, review, token):
    url = f'http://localhost:8000/api/review/{review.id+1}/'
    response = client.delete(url, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['detail'] == 'No Review matches the given query.'
    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.django_db
def test_delete_review_without_token(client, review, token):
    url = f'http://localhost:8000/api/review/{review.id}/'
    response = client.delete(url)
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_delete_review_with_invalid_token(client, review, token):
    url = f'http://localhost:8000/api/review/{review.id}/'
    response = client.delete(url, headers={"Authorization": f"Bearer {token.replace('a', 'b')}"})
    assert response.json()['code'] == "token_not_valid"
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
