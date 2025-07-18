from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.views import APIView

from rest_framework_simplejwt.authentication import JWTAuthentication
from .permissions import IsOwnerOfHall
from .models import Hall
from django.shortcuts import get_object_or_404

from .serializers import HallSerializer, HallRetrieveSerializer
# Create your views here.
@api_view(['GET'])
def index(request):
    return Response({"message": "Good to Go."}, status=status.HTTP_200_OK)

class HallRetrieveView(APIView):
    serializer_class = HallRetrieveSerializer

    def get(self, *args, **kwargs):
        id_ = self.request.GET.get('id')
        if id_:
            hall = get_object_or_404(Hall, id=id_)
            serializer = self.serializer_class(instance=hall)
            return Response({"hall": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "id is required!"}, status=status.HTTP_400_BAD_REQUEST)


class HallCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsOwnerOfHall]
    serializer_class = HallSerializer

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['owner'] = request.user.id
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Hall Created Successfully!", "data": serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class HallUpdateView(APIView):
    serializer_class = HallSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsOwnerOfHall]
    def put(self, request, *args, **kwargs):
        hall = get_object_or_404(Hall, id=request.data.get('id'))
        self.check_object_permissions(request, hall)
        serializer = self.serializer_class(instance=hall,data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Hall Updated Successfully!", "hall": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class HallDestroyView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsOwnerOfHall]

    def delete(self, request, *args, **kwargs):
        id_ = request.data.get("id")
        hall = get_object_or_404(Hall, id=id_)
        self.check_object_permissions(request, hall)
        hall.delete()
        return Response({"message": "Hall Deleted Successfully!"}, status=status.HTTP_200_OK)