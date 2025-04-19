from django.contrib import admin
from . models import Note,SharedNote

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display=('user','title','content')

@admin.register(SharedNote)
class SharedNoteAdmin(admin.ModelAdmin):
    pass