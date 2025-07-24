import pytest
from rest_framework import status

@pytest.mark.django_db
def test_get_hall_list(client):
    url = 'http://127.0.0.1:8000/api/hall/'
    response = client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['results'] == []

@pytest.mark.django_db
def test_get_specific_hall(client, hall):
    url = f'http://127.0.0.1:8000/api/hall/{hall.id}/'
    response = client.get(url)
    assert response.json()['name'] == hall.name
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_create_hall_without_token(client):
    url = 'http://127.0.0.1:8000/api/hall/'
    response = client.post(url, {'name': 'Mall 1', 'location': 'Lahore', 'capacity': 23})
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_create_hall_with_token(client, token):
    url = 'http://127.0.0.1:8000/api/hall/'
    response = client.post(url, {'name': 'Mall 13', 'location': 'Lahore', 'capacity': 26}, headers={'Authorization': f'Bearer {token}'})
    assert response.json()['name'] == 'Mall 13'
    assert response.status_code == status.HTTP_201_CREATED

@pytest.mark.django_db
def test_delete_hall_without_token(client, hall):
    url = f'http://127.0.0.1:8000/api/hall/{hall.id}/'
    response = client.delete(url)
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_delete_hall_with_token(client, token, hall):
    url = f'http://127.0.0.1:8000/api/hall/{hall.id}/'
    response = client.delete(url, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == status.HTTP_204_NO_CONTENT

@pytest.mark.django_db
def test_update_hall_without_token(client, hall):
    url = f'http://127.0.0.1:8000/api/hall/{hall.id}/'
    response = client.put(url, {'name': 'Mall 13', 'location': 'Lahore', 'capacity': 26})
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_update_hall_with_token(client, hall, token):
    url = f'http://127.0.0.1:8000/api/hall/{hall.id}/'
    response = client.put(url, {'name': 'Mall 13', 'location': 'Lahore', 'capacity': 26}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['name'] == 'Mall 13'

@pytest.mark.django_db
def test_update_hall_with_token_with_missing_keys(client, hall, token):
    url = f'http://127.0.0.1:8000/api/hall/{hall.id}/'
    response = client.put(url, {'name': 'Mall 13', 'location': 'Lahore'}, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['capacity'][0] =='This field is required.'

@pytest.mark.django_db
def test_patch_hall_without_token(client, hall):
    url = f'http://127.0.0.1:8000/api/hall/{hall.id}/'
    response = client.patch(url, {"name": "Mall 13"})
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_patch_hall_without_token(client, hall, token):
    url = f'http://127.0.0.1:8000/api/hall/{hall.id}/'
    response = client.patch(url, {"name": "Mall 13"}, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['name'] == 'Mall 13'
    assert response.json()['capacity'] == hall.capacity
    assert response.status_code == status.HTTP_200_OK
