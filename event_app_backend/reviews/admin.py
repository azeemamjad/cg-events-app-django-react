from django.contrib import admin
from .models import Review

class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'rating', 'event', 'event_id']
    list_display_links = ['id', 'title', 'rating']

admin.site.register(Review, ReviewAdmin)