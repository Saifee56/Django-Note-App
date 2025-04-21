from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import UserSignUpSerializer, UserLoginSerializer
from django.contrib.auth import login
from django.contrib.auth.models import User
from admin_panel.models import UserActivity
from rest_framework_simplejwt.tokens import RefreshToken

class UserAuthViewset(viewsets.ViewSet):

    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    @action(detail=False, methods=['post'], url_path='signup')
    def signup(self, request):
        data = request.data
        serializer = UserSignUpSerializer(data=data)

        if serializer.is_valid():
            user = serializer.save()
            UserActivity.objects.create(user=user, activity_type='signup')

            return Response({
                "message": "User signed up successfully",
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=['post'], url_path='login')
    def login_user(self, request):
        data = request.data
        serializer = UserLoginSerializer(data=data)

        if serializer.is_valid():
            user = serializer.validated_data['user']

            UserActivity.objects.create(user=user, activity_type='login')

            tokens = self.get_tokens_for_user(user)

            return Response({
                "message": "User logged in successfully",
                "tokens": tokens,
                "username":user.username
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
