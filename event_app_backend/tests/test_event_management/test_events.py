import pytest
from rest_framework import status

@pytest.mark.django_db
def test_get_event_list(client):
    url = 'http://127.0.0.1:8000/api/event/'
    response = client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['results'] == []

@pytest.mark.django_db
def test_get_specific_event(client, event):
    url = f'http://127.0.0.1:8000/api/event/{event.id}/'
    response = client.get(url)
    assert response.json()['title'] == event.title
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_create_event_without_token(client, hall, user2):
    url = 'http://127.0.0.1:8000/api/event/'
    response = client.post(url, {'title': 'Karan Aujla Concert', 'description': 'This is Incredible!', 'entry_fee': 2008, 'genre': 'Concert', 'organizers':[user2.id], 'hall': hall})
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_create_event_with_token(client, token, user2, hall):
    url = 'http://127.0.0.1:8000/api/event/'
    response = client.post(url, {'title': 'Karan Aujla Concert', 'description': 'This is Incredible!', 'entry_fee': 2008, 'genre': 'Concert', 'organizers':[user2.id], 'hall': hall.id}
                           , headers={'Authorization': f'Bearer {token}'})
    assert response.json()['title'] == user2.organized_events.all()[0].title # 'Karan Aujla Concert'
    assert response.status_code == status.HTTP_201_CREATED

@pytest.mark.django_db
def test_delete_event_without_token(client, event):
    url = f'http://127.0.0.1:8000/api/event/{event.id}/'
    response = client.delete(url)
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_delete_event_with_token(client, token, event):
    url = f'http://127.0.0.1:8000/api/event/{event.id}/'
    response = client.delete(url, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == status.HTTP_204_NO_CONTENT

@pytest.mark.django_db
def test_update_event_without_token(client, event, user2, hall):
    url = f'http://127.0.0.1:8000/api/event/{event.id}/'
    response = client.put(url, {'title': 'Karan Aujla Concert', 'description': 'This is Incredible!', 'entry_fee': 2008, 'genre': 'Concert', 'organizers':[user2.id], 'hall': hall})
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_update_event_with_token(client, event, token, user2, hall2):
    url = f'http://127.0.0.1:8000/api/event/{event.id}/'
    response = client.put(url, {'title': 'Karan Aujla Concert -U', 'description': 'This is Incredible!', 'entry_fee': 2008, 'genre': 'Concert', 'organizers':[user2.id], 'hall': hall2.id}
                          , headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['title'] == 'Karan Aujla Concert -U'

@pytest.mark.django_db
def test_update_event_with_token_with_missing_keys(client, event, token):
    url = f'http://127.0.0.1:8000/api/event/{event.id}/'
    response = client.put(url, {'title': 'Karan Aujla Concert -U', 'description': 'his is Incredible! -U'}, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['entry_fee'][0] == response.json()['hall'][0] == response.json()['genre'][0] == 'This field is required.'
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_patch_event_without_token(client, event):
    url = f'http://127.0.0.1:8000/api/event/{event.id}/'
    response = client.patch(url, {'title': 'Karan Aujla Concert -U'})
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_patch_event_with_token(client, event, token):
    url = f'http://127.0.0.1:8000/api/event/{event.id}/'
    response = client.patch(url, {"title": 'Karan Aujla Concert -U'}, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['title'] == 'Karan Aujla Concert -U'
    assert response.json()['description'] == event.description
    assert response.status_code == status.HTTP_200_OK
