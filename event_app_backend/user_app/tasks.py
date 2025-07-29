import time

from celery import shared_task
from django.core.mail import send_mail
import os

from user_app.models import AppUser


@shared_task
def send_otp_email(otp, email, link, user_id):
    send_mail(subject='One Time Password', message=f'Your otp is {otp}', from_email=os.getenv("EMAIL_ADDRESS"), html_message=f"""
<table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Segoe UI', Roboto, sans-serif;">
  <tr>
    <td align="center">
      <table width="500" cellpadding="0" cellspacing="0" style="max-width:500px; padding:30px; border:1px solid #eaeaea; border-radius:16px; background-color:#ffffff; box-shadow:0 4px 12px rgba(0, 0, 0, 0.05);">
        <tr>
          <td align="center" style="font-size:24px; color:#333; font-weight:600; padding-bottom:10px;">
            ✨ <span style="font-weight:600;">CG Events</span> ✨
          </td>
        </tr>
        <tr>
          <td align="center" style="font-size:26px; color:#2e7d32; font-weight:bold; padding:10px 0 15px;">
            Your OTP Code
          </td>
        </tr>
        <tr>
          <td align="center" style="font-weight:bold; color:#d32f2f; font-size:15px; padding-bottom:6px;">
            Please do not share this code with anyone.
          </td>
        </tr>
        <tr>
          <td align="center" style="color:#888; font-size:14px; padding-bottom:20px;">
            You can ignore this message if you did not request this code.
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:30px 0;">
            <table cellpadding="0" cellspacing="6">
              <tr>
                {''.join([
                  f'''
                  <td>
                    <span style="background-color:#ffeaea; color:#d32f2f; padding:12px 16px; border-radius:10px; font-size:20px; font-weight:bold; box-shadow:0 2px 6px rgba(0,0,0,0.1); display:inline-block;">
                      {i}
                    </span>
                  </td>
                  ''' for i in otp
                ])}
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="color:#444; font-size:14px; padding-bottom:20px;">
            Thank you for registering on <strong style="color:#6a1b9a;">CG Events</strong>!
          </td>
        </tr>
        <tr>
          <td align="center">
            <a href="{link}" style="background-color:#2e7d32; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:8px; font-size:16px; font-weight:600; display:inline-block;">
              Verify
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
"""
, recipient_list=[email])
    expire_otp.apply_async(args=[user_id], countdown=60)
    return None

@shared_task
def expire_otp(user_id):
    user = AppUser.objects.filter(id=user_id).first()
    if user:
        user.otp = ""
        user.save()

@shared_task
def delete_unverified_user(email):
    user = AppUser.objects.filter(email=email, verified=False).first()
    if user:
        user.delete()
    return None