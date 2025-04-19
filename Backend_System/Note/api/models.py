from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


class Note(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_notes")
    title=models.CharField(max_length=120)
    content=models.CharField(max_length=120)

    class Meta:
        verbose_name="Note"
        verbose_name_plural="Notes"

class SharedNote(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='shared_notes')
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE)
    access_type = models.CharField(max_length=10, choices=(('view', 'View'), ('edit', 'Edit')))