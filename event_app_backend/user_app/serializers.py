from rest_framework import serializers
from .models import AppUser
from rest_framework.exceptions import ValidationError

class AppUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'date_joined', 'profile_picture', 'verified', 'role']


class AppUserRegisterSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)
    confirm_password = serializers.CharField(write_only=True)
    class Meta:
        model = AppUser
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'profile_picture', 'role', 'confirm_password']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
        }
    def validate_confirm_password(self, value):
        password = self.initial_data.get("password")
        if password == value:
            return value
        else:
            raise ValidationError("Password and Confirm Password Are not Same!")

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return AppUser.objects.create_user(**validated_data)

class AppUserUpdateSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)
    email = serializers.EmailField(read_only=True)
    class Meta:
        model = AppUser
        fields = ['password', 'first_name', 'last_name', 'email', 'profile_picture']
        extra_kwargs = {
            'password': {'write_only': True},
        }

        def update(self, instance, validated_data):
            password = validated_data.pop('password', None)
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            if password:
                instance.set_password(password)
            instance.save()
            return instance

class AppUserVerifySerializer(serializers.Serializer):
    email = serializers.CharField(required=True)
    otp = serializers.CharField(required=False)
    class Meta:
        fields = ['email', 'otp']
