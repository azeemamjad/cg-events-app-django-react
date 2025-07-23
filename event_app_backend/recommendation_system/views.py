from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from event_management_app.models import Event
from event_management_app.serializers import EventListSerializer

from booking.models import Booking
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.utils import timezone

from django.db.models import Q

class EventRecommendView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_bookings = Booking.objects.filter(user=user).select_related('event')
        categories = user_bookings.values_list('event__genre', flat=True)
        halls = user_bookings.values_list('event__hall', flat=True)
        print(categories)
        recommended_events = Event.objects.filter(
            Q(genre__in=categories) | Q(hall__in=halls),
            start_time__gt=timezone.now()
        ).exclude(
            bookings__user=user
        ).distinct()[:10]

        serializer = EventListSerializer(recommended_events, many=True)
        return Response(serializer.data)