from django.db.models import IntegerField
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status

from .models import Hall, Event, EventImage
from user_app.serializers import AppUserSerializer
from user_app.models import AppUser

from booking.models import Booking

class HallSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    verified = serializers.BooleanField(read_only=True)
    owner = serializers.PrimaryKeyRelatedField(required=False, read_only=True)
    class Meta:
        model = Hall
        fields = ['id', 'name', 'location', 'capacity', 'verified', 'owner']
        extra_kwargs = {
            'capacity': {'required': True}
        }
    def validate_capacity(self, cap):
        if cap <= 0:
            raise ValidationError("Sorry we can't create a Hall with Capacity less than or equal to 0.")
        return cap
class HallRetrieveSerializer(serializers.ModelSerializer):
    owner = AppUserSerializer(read_only=True)
    class Meta:
        model = Hall
        fields = ['id', 'name', 'location', 'capacity', 'verified', 'owner']

class HallListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = ['id', 'name', 'location', 'capacity', 'verified', 'owner']

class EventImageSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = EventImage
        fields = ['id', 'title', 'image']

class EventSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    hall = serializers.PrimaryKeyRelatedField(queryset=Hall.objects.all(), required=True)

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'entry_fee', 'genre', 'hall', 'start_time', 'end_time', 'created_at', 'updated_at']

    def validate_hall(self, hall):
        start_time_str = self.initial_data.get("start_time")
        end_time_str = self.initial_data.get("end_time")
        if not start_time_str or not end_time_str:
            return hall
        start_time = parse_datetime(start_time_str)
        end_time = parse_datetime(end_time_str)
        if start_time > end_time:
            raise ValidationError("Start Time Can't be greater than end Time!")
        if start_time < timezone.now():
            raise ValidationError("Sorry! We can't go to past!")
        overlapping_events = hall.events.filter(
            start_time__lt=end_time,
            end_time__gt=start_time
        )
        if self.instance:
            overlapping_events = overlapping_events.exclude(id=self.instance.id)
        if overlapping_events.exists():
            raise ValidationError("There can't be two events in the same hall at the same time.")
        return hall

class EventListSerializer(serializers.ModelSerializer):
    remaining_bookings = serializers.SerializerMethodField()
    class Meta:
        model =Event
        fields = ['id', 'images', 'title', 'description', 'genre', 'remaining_bookings','hall', 'start_time', 'end_time', 'created_at', 'updated_at']

    def get_remaining_bookings(self, obj):
        count = obj.bookings.count()
        if not obj.hall:
            return 0
        if count:
            remaining = obj.hall.capacity - count
            return remaining
        else:
            return 0

    def get_description(self, obj):
        return obj.description[:20]

class AppUserInlineSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.CharField()

class BookingInlineSerializer(serializers.Serializer):
    user = AppUserInlineSerializer( read_only=True)
    seat_no = serializers.IntegerField()

class EventRetrieveSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    organizers = AppUserSerializer(many=True, read_only=True)
    bookings = BookingInlineSerializer(many=True, read_only=True)
    images = EventImageSerializer(many=True, read_only=True)
    remaining_seats = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'entry_fee', 'genre', 'remaining_seats', 'hall', 'start_time', 'end_time', 'created_at', 'updated_at', 'organizers', 'bookings', 'images']

    def get_remaining_seats(self, obj):
        total_bookings = obj.bookings.count()
        if obj.hall and obj.hall.capacity is not None:
            return max(obj.hall.capacity - total_bookings, 0)
        return None
