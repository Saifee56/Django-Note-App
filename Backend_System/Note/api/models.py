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
