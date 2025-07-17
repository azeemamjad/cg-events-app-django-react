from rest_framework.views import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView
from .serializers import AppUserRegisterSerializer, AppUserVerifySerializer

@api_view(['GET'])
def home(request):
    return Response(data={'message': 'Server is running!'}, status=200)


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
        ...
