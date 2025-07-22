from django.contrib import admin
from .models import Booking

class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'user_username', 'user_id', 'seat_no']
    list_display_links = ['id', 'user_username']

    def user_username(self, obj):
        return obj.user.username
    user_username.short_description = 'Username'

    def user_id(self, obj):
        return obj.user.id
    user_id.short_description = 'User ID'

admin.site.register(Booking, BookingAdmin)