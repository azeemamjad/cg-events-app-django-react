from django.contrib import admin
from django.contrib.auth import get_user_model
from  .models import AppUser
# Register your models here.

# AppUser = get_user_model()

class AppUserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'first_name', 'last_name', 'email']
    list_display_links = ['id', 'username']

admin.site.register(AppUser, AppUserAdmin)
