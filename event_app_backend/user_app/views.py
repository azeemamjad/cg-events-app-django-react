from rest_framework.views import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView
from .serializers import AppUserRegisterSerializer, AppUserVerifySerializer
from .models import AppUser
from django.shortcuts import get_object_or_404
import random

from .tasks import send_otp_email

@api_view(['GET'])
def home(request):
    return Response(data={'message': 'Server is running!'}, status=200)

# @api_view(['GET'])
# def index(request):
#     send_otp_email.delay()
#     return Response(data={"message": "Email Has Been Sent!"}, status=status.HTTP_200_OK)

class AppUserRegisterView(APIView):
    serializer_class = AppUserRegisterSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = AppUserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AppUserVerifyView(APIView):
    serializer_class = AppUserVerifySerializer
    def post(self, request, *args, **kwargs):
        serializer = AppUserVerifySerializer(data=request.data)
        if serializer.is_valid():
            if serializer.data.get('otp', ''):
                otp = serializer.data.get('otp')
                user = get_object_or_404(AppUser, email=serializer.data.get("email"))
                if user.otp == otp:
                    user.verified = True
                    user.otp = ''
                    user.save()
                    return Response({"message": "Verified Successfully!"}, status=status.HTTP_200_OK)
                else:
                    return Response({"message": "Your OTP is Incorrect!"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                otp = [str(random.choice([i for i in range(0, 10)])) for i in range(6)]
                otp = "".join(otp)
                email = serializer.data.get("email")
                user = get_object_or_404(AppUser, email=email)
                user.otp = otp
                send_otp_email.delay(otp=otp, email=email, link=f"http://{request.get_host()}/verify/?email={email}&otp={otp}")
                user.save()
                return Response({"message": f"OTP sent Successfully! to {email}"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        if request.GET.get('email') and request.GET.get('otp'):
            otp = request.GET.get('otp')
            user = get_object_or_404(AppUser, email=request.GET.get('email'))
            if user.otp == otp:
                user.verified = True
                user.otp = ''
                user.save()
                return Response({"message": "Verified Successfully!"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Your OTP is Incorrect!"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "Email and Otp not found!"}, status=status.HTTP_400_BAD_REQUEST)

