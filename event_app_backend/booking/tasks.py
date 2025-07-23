import time

from celery import shared_task
from django.core.mail import send_mail
import os

from event_management_app.models import Event
from user_app.models import AppUser
from .models import Booking


@shared_task
def create_booking_task(event_id, user_id, booking_id):
    event = Event.objects.get(id=event_id)
    user = AppUser.objects.get(id=user_id)
    booking = Booking.objects.get(id=booking_id)
    send_confirmation_mail(booking_id=booking.id, seat_no=booking.seat_no,
                           event_id=event_id, event_name=event.title, event_genre=event.genre,
                           hall_id=event.hall.id, hall_location=event.hall.location, hall_name=event.hall.name, email=user.email)
    return "Booking Created!"

@shared_task
def send_confirmation_mail(booking_id, seat_no, event_name, event_genre, event_id, hall_name, hall_location, hall_id, email):
    html_content = f"""<table style="width:100%; font-family:'Segoe UI', Roboto, sans-serif;">
      <tr>
        <td align="center">
          <table style="max-width:600px; padding:30px; border:1px solid #eaeaea; border-radius:12px; background-color:#ffffff;">
            <tr>
              <td align="center" style="font-size:22px; font-weight:600; color:#4CAF50; padding-bottom:16px;">
                🎟️ Booking Confirmation – CG Events
              </td>
            </tr>
            <tr>
              <td style="font-size:16px; color:#333; padding-bottom:8px;">
                <strong>Booking ID:</strong> {booking_id}
              </td>
            </tr>
            <tr>
              <td style="font-size:16px; color:#333; padding-bottom:8px;">
                <strong>Seat Number:</strong> {seat_no}
              </td>
            </tr>
            <tr>
              <td style="font-size:16px; color:#333; padding-bottom:8px;">
                <strong>Event Name:</strong> {event_name}
              </td>
            </tr>
            <tr>
              <td style="font-size:16px; color:#333; padding-bottom:8px;">
                <strong>Event Genre:</strong> {event_genre}
              </td>
            </tr>
            <tr>
              <td style="font-size:16px; color:#333; padding-bottom:8px;">
                <strong>Event ID:</strong> {event_id}
              </td>
            </tr>
            <tr>
              <td style="font-size:16px; color:#333; padding-bottom:8px;">
                <strong>Hall Name:</strong> {hall_name}
              </td>
            </tr>
            <tr>
              <td style="font-size:16px; color:#333; padding-bottom:8px;">
                <strong>Hall Location:</strong> {hall_location}
              </td>
            </tr>
            <tr>
              <td style="font-size:16px; color:#333; padding-bottom:20px;">
                <strong>Hall ID:</strong> {hall_id}
              </td>
            </tr>
            <tr>
              <td style="font-size:14px; color:#777;">
                Thank you for booking with <strong>CG Events</strong>! We look forward to seeing you at the event.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    """
    send_mail(subject='One Time Password', message=f'This is your confirmation for booking! {booking_id}', from_email=os.getenv("EMAIL_ADDRESS"),
              html_message=html_content
              , recipient_list=[email])
    return None
