import pytest
from rest_framework import status

@pytest.mark.django_db
def test_get_bookings(client, booking, token):
    url = 'http://localhost:8000/api/booking/'
    response = client.get(url, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['results'][0]['event_title'] == booking.event.title
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_get_bookings_with_invalid_token(client, booking, token):
    url = 'http://localhost:8000/api/booking/'
    response = client.get(url, headers={"Authorization": f"Bearer {token.replace('a', 'b')}"})
    assert response.json()['code'] == "token_not_valid"
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_get_bookings_without_token(client, booking):
    url = 'http://localhost:8000/api/booking/'
    response = client.get(url)
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_get_booking(client, booking, token):
    url = f'http://localhost:8000/api/booking/{booking.id}/'
    response = client.get(url, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['event']['title'] == booking.event.title
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_get_booking_with_invalid_token(client, booking, token):
    url = f'http://localhost:8000/api/booking/{booking.id}/'
    response = client.get(url, headers={"Authorization": f"Bearer {token.replace('a', 'b')}"})
    assert response.json()['code'] == "token_not_valid"
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_get_booking_without_token(client, booking):
    url = f'http://localhost:8000/api/booking/{booking.id}/'
    response = client.get(url)
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_create_bookings(client, token, event):
    url = 'http://localhost:8000/api/booking/'
    response = client.post(url, {"event": event.id, "seat_no": 10 }, headers={"Authorization": f"Bearer {token}"})
    assert  response.json()['message'] == 'Booking is being processed'
    assert response.status_code == status.HTTP_202_ACCEPTED

@pytest.mark.django_db
def create_booking_with_no_body(client, token):
    url = 'http://localhost:8000/api/booking/'
    response = client.post(url, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['event'][0] == response.json()['seat_no'][0] == 'This field is required.'
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def create_booking_with_wrong_event(client, token):
    url = 'http://localhost:8000/api/booking/'
    response = client.post(url, {"event": 44, "seat_no": 10 }, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['event'][0] == 'Invalid pk "44" - object does not exist.'
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_create_bookings_with_no_token(client, event):
    url = 'http://localhost:8000/api/booking/'
    response = client.post(url, {"event": event.id, "seat_no": 10 })
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_create_bookings_with_invalid_token(client, token, event):
    url = 'http://localhost:8000/api/booking/'
    response = client.post(url, {"event": event.id, "seat_no": 10}, headers={"Authorization": f"Bearer {token.replace('a', 'b')}"})
    assert response.json()['code'] == "token_not_valid"
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_create_booking_again_on_same_seat_same_event(client, token, event, booking):
    url = 'http://localhost:8000/api/booking/'
    response = client.post(url, {"event": event.id, "seat_no": booking.seat_no}, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['seat_no'][0] == 'Seat number is already taken!'
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_create_booking_again_on_invalid_seat_no(client, token, event, booking):
    url = 'http://localhost:8000/api/booking/'
    response = client.post(url, {"event": event.id, "seat_no": 71}, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['seat_no'][0] == 'Invalid seat number: exceeds hall capacity.'
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_update_booking(client, token, booking):
    url = f'http://localhost:8000/api/booking/{booking.id}/'
    response = client.put(url, {"event": booking.event.id, "seat_no": 12 }, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['seat_no'] == 12
    assert response.json()['seat_no'] != booking.seat_no
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_update_booking_with_partial_data(client, token, booking):
    url = f'http://localhost:8000/api/booking/{booking.id}/'
    response = client.put(url, {"seat_no": 12 }, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['event'][0] == 'This field is required.'
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_update_booking_with_invalid_seat(client, token, booking):
    url = f'http://localhost:8000/api/booking/{booking.id}/'
    response = client.put(url, {"event": booking.event.id, "seat_no": 41 }, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['seat_no'][0] == 'Invalid seat number: exceeds hall capacity.'
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_update_booking_with_no_token(client, booking):
    url = f'http://localhost:8000/api/booking/{booking.id}/'
    response = client.put(url, {"event": booking.event.id, "seat_no": 12 })
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_update_booking_with_invalid_token(client, token, booking):
    url = f'http://localhost:8000/api/booking/{booking.id}/'
    response = client.put(url, {"event": booking.event.id, "seat_no": 12 }, headers={"Authorization": f"Bearer {token.replace('a', 'b')}"})
    assert response.json()['code'] == "token_not_valid"
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_update_booking_with_selected_fields(client, token, booking):
    url = f'http://localhost:8000/api/booking/{booking.id}/'
    response = client.patch(url, {"seat_no": 12 }, headers={"Authorization": f"Bearer {token}"})
    assert response.json()['seat_no'] == 12
    assert response.json()['seat_no'] != booking.seat_no
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_delete_booking(client, token, booking):
    url = f'http://localhost:8000/api/booking/{booking.id}/'
    response = client.delete(url, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_204_NO_CONTENT

@pytest.mark.django_db
def test_delete_booking_without_token(client, booking):
    url = f'http://localhost:8000/api/booking/{booking.id}/'
    response = client.delete(url)
    assert response.json()['detail'] == 'Authentication credentials were not provided.'
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_delete_booking_with_invalid_token(client, token, booking):
    url = f'http://localhost:8000/api/booking/{booking.id}/'
    response = client.delete(url, headers={"Authorization": f"Bearer {token.replace('a', 'b')}"})
    assert response.json()['code'] == "token_not_valid"
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


