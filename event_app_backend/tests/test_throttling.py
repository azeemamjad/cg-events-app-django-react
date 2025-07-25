import time

import pytest
from rest_framework import status

@pytest.mark.django_db
def test_throttling_with_while_loop_authenticated_user(client, token):
    url = '/api/event/'
    max_attempts = 61
    count = 0
    un_auth_req_count = 0
    response = None
    while count < max_attempts:
        response = client.get(url)
        count += 1
        un_auth_req_count += 1
        if response.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
            break
    assert 'Request was throttled.' in response.json()['detail']
    assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
    auth_req_count = 0
    count = 0
    response = None
    while count < max_attempts:
        auth_req_count += 1
        response = client.get(url, headers={"Authorization": f"Bearer {token}"})
        count += 1
        if response.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
            break
    assert 'Request was throttled.' in response.json()['detail']
    assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
    assert auth_req_count > un_auth_req_count

@pytest.mark.django_db
def test_throttling_with_while_loop_with_anonymous_user(client):
    url = '/api/event/'
    max_attempts = 41
    count = 0
    while count < max_attempts:
        response = client.get(url)
        count += 1
        if response.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
            break
    assert 'Request was throttled.' in response.json()['detail']
    assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS