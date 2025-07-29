from django.shortcuts import get_object_or_404
from django.template.context_processors import request
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

from event_management_app.models import Event
from .permissions import IsOwnerOfBooking

from .models import Booking
from .serializers import BookingRetrieveSerializer, BookingListSerializer, BookingSerializer
from .tasks import create_booking_task
from .filters import BookingFilterSet
from django_filters.rest_framework import DjangoFilterBackend

class BookingViewSet(ModelViewSet):
    queryset = Booking.objects.all().prefetch_related('user', 'event')
    serializer_class = BookingRetrieveSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOfBooking]
    filter_backends = [DjangoFilterBackend]
    filterset_class = BookingFilterSet

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).prefetch_related('user', 'event').order_by('id')
    def get_serializer_class(self):
        if self.action == 'list':
            return BookingListSerializer
        elif self.request.method == "GET":
            return BookingRetrieveSerializer
        else:
            return  BookingSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer.validated_data)
        return Response({"message": "Booking is being processed"}, status=status.HTTP_202_ACCEPTED)

    def perform_create(self, validated_data):
        # Pass required fields to the celery task
        user = self.request.user
        event_id = validated_data['event'].id
        seat_no = validated_data['seat_no']
        event = get_object_or_404(Event, id=event_id)
        booking = Booking.objects.create(event=event, user=user, seat_no=seat_no)
        booking.save()
        create_booking_task.delay(event_id, user.id, booking.id)