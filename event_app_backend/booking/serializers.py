from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from event_management_app.models import Event
from user_app.models import AppUser
from .models import Booking
from django.utils import timezone

class BookingSerializer(serializers.ModelSerializer):
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all(), required=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Booking
        fields = ['id', 'event', 'user', 'seat_no']

    def validate_seat_no(self, value):
        event_id = self.initial_data.get("event")
        if event_id is None and self.instance:
            event = self.instance.event
        else:
            try:
                event = Event.objects.select_related("hall").prefetch_related("bookings").get(id=event_id)
            except Event.DoesNotExist:
                raise ValidationError("Invalid event.")
        if event.bookings.filter(seat_no=value).exclude(id=self.instance.id if self.instance else None).exists():
            [print(i.id) for i in event.bookings.filter(seat_no=value).exclude(id=self.instance.id if self.instance else None)]
            raise ValidationError("Seat number is already taken!")
        try:
            numeric_seat = int(value)
        except ValueError:
            raise ValidationError("Seat number must be numeric.")
        if event.hall and event.hall.capacity and numeric_seat > event.hall.capacity:
            raise ValidationError("Invalid seat number: exceeds hall capacity.")
        return value


class BookingListSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    event_title = serializers.SerializerMethodField()
    past = serializers.SerializerMethodField()
    class Meta:
        model = Booking
        fields = ['id', 'username', 'event_title', 'seat_no', 'past']

    def get_past(self, obj):
        return obj.event.end_time < timezone.now()

    def get_username(self, obj):
        return obj.user.username

    def get_event_title(self, obj):
        return obj.event.title

class HallInlineSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    location = serializers.CharField()

class EventInlineSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    description = serializers.CharField()
    hall = HallInlineSerializer()

class UserInlineSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()

class BookingRetrieveSerializer(serializers.ModelSerializer):
    event = EventInlineSerializer()
    user = UserInlineSerializer()
    class Meta:
        model = Booking
        fields = ['id', 'user', 'event', 'seat_no']