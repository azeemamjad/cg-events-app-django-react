import time

from celery import shared_task
from django.core.mail import send_mail
import os


@shared_task
def sleepy(duration: int):
    time.sleep(duration)
    return None

@shared_task
def send_email():
    time.sleep(5)
    send_mail(subject='Celery', message='Task Worked', from_email=os.getenv("EMAIL_ADDRESS"), html_message='<h1>Congratulations!</h1>', recipient_list=['azeemamjad225@gmail.com'])
    return None