from django.db.models import IntegerField
from rest_framework import serializers
from .models import Hall, Event, EventImage
from user_app.serializers import AppUserSerializer
from user_app.models import AppUser

class HallSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    verified = serializers.BooleanField(read_only=True)
    owner = serializers.IntegerField(read_only=True)
    class Meta:
        model = Hall
        fields = ['id', 'name', 'location', 'capacity', 'verified', 'owner']


class HallRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = ['id', 'name', 'location', 'capacity', 'verified', 'owner']

class EventImageSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = EventImage
        fields = ['id', 'title', 'image']


class AppUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'date_joined', 'profile_picture', 'verified', 'role']


class EventSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    organizers = AppUserSerializer(many=True, read_only=True)
    attendees = AppUserSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'start_time', 'end_time', 'created_at', 'updated_at', 'organizers', 'attendees']

class EventRetrieveSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    organizers = AppUserSerializer(many=True, read_only=True)
    attendees = AppUserSerializer(many=True, read_only=True)
    images = EventImageSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'start_time', 'end_time', 'created_at', 'updated_at', 'organizers', 'attendees', 'images']
