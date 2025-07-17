from django.urls import path
from .views import home, index, AppUserRegisterView

urlpatterns = [
    path('',home ,name='home'),
    path('index/', index, name='index'),
    path('register/', AppUserRegisterView.as_view(), name='register-view')
]