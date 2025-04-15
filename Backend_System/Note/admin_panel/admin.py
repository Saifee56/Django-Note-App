from django.contrib import admin
from . models import *

@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display=('user','activity_type','timestamp')
    list_filter=('activity_type', 'timestamp')
