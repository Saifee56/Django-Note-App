from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import action

from django.contrib.auth.models import User
from .models import UserActivity
from .serializers import UserActivitySerializer


class UserActivityViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]  

    @action(detail=False, methods=['get'], url_path='all')
    def get_all_activities(self, request):
        try:
            activities = UserActivity.objects.select_related('user').order_by('-timestamp')
            serializer = UserActivitySerializer(activities, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['get'], url_path='user-activities/(?P<username>[^/.]+)')
    def get_user_activities(self, request, username=None):
        try:
            activities = UserActivity.objects.filter(user__username=username).select_related('user').order_by('-timestamp')
            serializer = UserActivitySerializer(activities, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
