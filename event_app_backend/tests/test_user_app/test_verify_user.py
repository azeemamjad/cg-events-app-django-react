import pytest
from rest_framework import status
from user_app.models import AppUser

@pytest.mark.django_db
def test_verify_user(client, user):
    url = 'http://localhost:8000/api/user/verify/'
    response = client.post(url, {"email": user.email})
    assert response.json()['message'] == 'OTP sent Successfully! to admin@gmail.com'
    assert response.status_code == status.HTTP_200_OK
    user = AppUser.objects.get(id=user.id)
    response = client.post(url, {"email": user.email, "otp": user.otp})
    assert response.json()['message'] == 'Verified Successfully!'
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_verify_user_no_body(client, user):
    url = 'http://localhost:8000/api/user/verify/'
    response = client.post(url)
    assert response.json()['email'][0] == 'This field is required.'
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_verify_user_wrong_email(client, user):
    url = 'http://localhost:8000/api/user/verify/'
    response = client.post(url, {"email": "reet@gmail.com"})
    assert response.json()['detail'] == 'No AppUser matches the given query.'
    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.django_db
def test_verify_user_with_invalid_email(client, user):
    url = 'http://localhost:8000/api/user/verify/'
    response = client.post(url, {"email": "qqq"})
    assert response.json()['email'][0] == 'Enter a valid email address.'
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_verify_user_with_wrong_otp(client, user):
    url = 'http://localhost:8000/api/user/verify/'
    response = client.post(url, {"email": user.email})
    assert response.json()['message'] == 'OTP sent Successfully! to admin@gmail.com'
    assert response.status_code == status.HTTP_200_OK
    user = AppUser.objects.get(id=user.id)
    response = client.post(url, {"email": user.email, "otp": user.otp.replace(user.otp[0], user.otp[1])})
    assert response.json()['message'] == 'Your OTP is Incorrect!'
    assert response.status_code == status.HTTP_400_BAD_REQUEST


