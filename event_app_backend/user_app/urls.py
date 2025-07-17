from django.urls import path
from .views import home, index, AppUserRegisterView, AppUserVerifyView

urlpatterns = [
    path('',home ,name='home'),
    # path('index/', index, name='index'),
    path('register/', AppUserRegisterView.as_view(), name='register-view'),
    path('verify/', AppUserVerifyView.as_view(), name='verify-view')
]