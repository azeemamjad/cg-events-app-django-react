from rest_framework import serializers
from .models import AppUser

class AppUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = '__all__'


class AppUserRegisterSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)
    class Meta:
        model = AppUser
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'profile_picture', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        return AppUser.objects.create_user(**validated_data)

class AppUserVerifySerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    otp = serializers.CharField(required=False)
    class Meta:
        fields = ['email', 'otp']
