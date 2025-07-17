from django.urls import path
from .views import home, AppUserRegisterView

urlpatterns = [
    path('',home ,name='home'),
    path('register/', AppUserRegisterView.as_view(), name='register-view')
]