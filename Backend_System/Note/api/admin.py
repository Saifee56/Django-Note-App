from django.contrib import admin
from . models import Note

@admin.register(Note)
class UserActivityAdmin(admin.ModelAdmin):
    list_display=('user','title','content')

