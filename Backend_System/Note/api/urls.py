from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .auth_viewset import UserAuthViewset
from . note_viewset import *

app_name='api'
router = DefaultRouter()
router.register('auth', UserAuthViewset, basename='user-auth')
router.register('note',NoteViewset,basename='note')

urlpatterns = [
    path('', include(router.urls)),
]