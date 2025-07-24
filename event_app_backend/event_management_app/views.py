from django.template.context_processors import request
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

import redis
import json

from .permissions import IsOwnerOfHall, IsOwnerOfEvent
from .models import Hall, Event
from user_app.models import AppUser
from .serializers import HallSerializer, HallRetrieveSerializer, HallListSerializer, EventSerializer, EventRetrieveSerializer, EventListSerializer

from .filters import EventFilter
from django_filters.rest_framework import DjangoFilterBackend

class HallViewSet(ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOfHall]
    queryset = Hall.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return HallListSerializer
        elif self.request.method == 'GET':
            return HallRetrieveSerializer
        return HallSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save()


r = redis.Redis(host='localhost', port=6379, db=0)
CACHE_KEY = "events_list_cache"
CACHE_TIMEOUT = 10


class EventViewSet(ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOfEvent]
    queryset = Event.objects.filter(past_event=False).prefetch_related('organizers', 'bookings', 'images')
    filterset_class = EventFilter
    filter_backends = [DjangoFilterBackend]

    def get_serializer_class(self):
        if self.action == 'list':
            return EventListSerializer
        elif self.request.method == 'GET':
            return EventRetrieveSerializer
        return EventSerializer

    def get_queryset(self):
        return Event.objects.filter(past_event=False).prefetch_related('organizers', 'bookings', 'images')

    def _get_cache_key(self, request=None):
        """Generate cache key based on filters and query parameters"""
        if request and request.query_params:
            # Include query parameters in cache key for filtered results
            query_string = "&".join([f"{k}={v}" for k, v in sorted(request.query_params.items())])
            return f"{CACHE_KEY}_{hash(query_string)}"
        return CACHE_KEY

    def _invalidate_cache(self):
        """Clear all event-related cache entries"""
        try:
            # Get all keys matching our pattern
            pattern = f"{CACHE_KEY}*"
            keys = r.keys(pattern)
            if keys:
                r.delete(*keys)
        except Exception as e:
            # Log error but don't break the flow
            print(f"Cache invalidation error: {e}")

    def _get_cached_data(self, cache_key):
        """Retrieve data from cache"""
        try:
            cached_data = r.get(cache_key)
            if cached_data:
                return json.loads(cached_data.decode('utf-8'))
        except Exception as e:
            print(f"Cache retrieval error: {e}")
        return None

    def _set_cached_data(self, cache_key, data):
        """Store data in cache"""
        try:
            r.setex(cache_key, CACHE_TIMEOUT, json.dumps(data, default=str))
        except Exception as e:
            print(f"Cache storage error: {e}")

    def list(self, request, *args, **kwargs):
        """Override list method to implement caching"""
        cache_key = self._get_cache_key(request)

        # Try to get from cache first
        cached_data = self._get_cached_data(cache_key)
        if cached_data:
            return Response(cached_data)

        # If not in cache, get from database
        response = super().list(request, *args, **kwargs)

        # Cache the response data
        if response.status_code == 200:
            self._set_cached_data(cache_key, response.data)

        return response

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve method to implement caching"""
        event_id = kwargs.get('pk')
        cache_key = f"event_detail_{event_id}"

        # Try to get from cache first
        cached_data = self._get_cached_data(cache_key)
        if cached_data:
            return Response(cached_data)

        # If not in cache, get from database
        response = super().retrieve(request, *args, **kwargs)

        # Cache the response data
        if response.status_code == 200:
            self._set_cached_data(cache_key, response.data)

        return response

    def perform_create(self, serializer):
        """Override to clear cache after creation"""
        organizer_list = [self.request.user]
        user_ids = self.request.data.get("users", [])
        if user_ids:
            additional_users = AppUser.objects.filter(id__in=user_ids)
            organizer_list.extend(additional_users)

        serializer.instance.organizers.set(organizer_list)
        serializer.save()

        # Invalidate cache after creation
        self._invalidate_cache()

    def perform_update(self, serializer):
        """Override to clear cache after update"""
        organizer_list = [self.request.user]
        user_ids = self.request.data.get("users", [])
        if user_ids:
            additional_users = AppUser.objects.filter(id__in=user_ids)
            organizer_list.extend(additional_users)

        serializer.save()
        serializer.instance.organizers.set(organizer_list)

        # Invalidate cache after update
        self._invalidate_cache()

    def perform_destroy(self, instance):
        """Override to clear cache after deletion"""
        super().perform_destroy(instance)

        # Invalidate cache after deletion
        self._invalidate_cache()
