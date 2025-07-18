from django.urls import path
from .views import home, AppUserRegisterView, AppUserVerifyView, AppUserGetView, AppUserUpdateView

urlpatterns = [
    path('',home ,name='home'),
    # path('index/', index, name='index'),
    path('register/', AppUserRegisterView.as_view(), name='register-view'),
    path('verify/', AppUserVerifyView.as_view(), name='verify-view'),
    path('getme/', AppUserGetView.as_view(), name='get-me'),
    path('update/', AppUserUpdateView.as_view(), name='update-view'),
]