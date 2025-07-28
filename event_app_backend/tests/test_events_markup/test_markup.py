import pytest
from rest_framework import status

@pytest.mark.django_db
def test_past_event_markup(client):
    url = 'http://localhost:8000/api/schedule-event-markup/'
    response = client.get(url)
    assert response.json()['status'] == 'Task Scheduled!'
    assert response.status_code == status.HTTP_200_OK