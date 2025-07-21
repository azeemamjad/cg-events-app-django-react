from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from django.utils import timezone

from .permissions import IsOwnerOfHall, IsOwnerOfEvent
from .models import Hall, Event
from user_app.models import AppUser
from .serializers import HallSerializer, HallRetrieveSerializer, EventSerializer, EventRetrieveSerializer

class HallViewSet(ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOfHall]
    queryset = Hall.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return HallRetrieveSerializer
        return HallSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save()


# views.py
class EventViewSet(ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOfEvent]
    queryset = Event.objects.all().prefetch_related('organizers', 'attendees', 'images')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return EventRetrieveSerializer
        return EventSerializer

    def perform_create(self, serializer):
        organizer_list = [self.request.user]
        user_ids = self.request.data.get("users", [])
        if user_ids:
            additional_users = AppUser.objects.filter(id__in=user_ids)
            organizer_list.extend(additional_users)
        serializer.save()
        serializer.instance.organizers.set(organizer_list)

    def perform_update(self, serializer):
        organizer_list = [self.request.user]
        user_ids = self.request.data.get("users", [])
        if user_ids:
            additional_users = AppUser.objects.filter(id__in=user_ids)
            organizer_list.extend(additional_users)
        serializer.save()
        serializer.instance.organizers.set(organizer_list)
