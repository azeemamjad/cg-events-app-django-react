from django.contrib import admin
from .models import Hall, Event, EventImage

class HallAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'location', 'capacity', 'verified', 'owner']
    list_display_links = ['id', 'name']

class EventAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'created_at']
    list_display_links = ['id', 'title']

class EventImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'event']
    list_display_links = ['id', 'title']

admin.site.register(Hall, HallAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(EventImage, EventImageAdmin)