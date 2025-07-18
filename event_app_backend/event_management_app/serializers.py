from rest_framework import serializers
from .models import Hall

class HallSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    verified = serializers.BooleanField(read_only=True)
    class Meta:
        model = Hall
        fields = ['id', 'name', 'location', 'capacity', 'verified', 'owner']


class HallRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = ['id', 'name', 'location', 'capacity', 'verified', 'owner']
