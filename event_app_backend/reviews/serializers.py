from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'title', 'description', 'rating','event']

    def validate_event(self, event):
        user = self.context['request'].user
        review_by_user_in_that_event = Review.objects.filter(user=user, event=event).first()
        if review_by_user_in_that_event and not self.instance:
            raise ValidationError("You Can't Review a Single Event Twice!")
        user_booking = event.bookings.filter(user=user).first()
        if user_booking:
            return event
        else:
            raise ValidationError("You don't have any bookings in this event!")

class ReviewListSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    user_fullname = serializers.CharField(source='user.get_full_name', read_only=True)
    class Meta:
        model = Review
        fields = ['id', 'title', 'description', 'rating','event', 'user', 'user_fullname']

class ReviewRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'title', 'description', 'rating','event', 'user']