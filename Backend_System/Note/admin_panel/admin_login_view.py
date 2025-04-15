from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .serializers import AdminLoginSerializer


class AdminLoginViewSet(viewsets.ViewSet):


    def get_tokens_for_admin(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    
    @action(detail=False, methods=['post'], url_path='login-admin')
    def login_admin(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_staff:  
            return Response({"error": "You do not have admin privileges"}, status=status.HTTP_403_FORBIDDEN)

        tokens = self.get_tokens_for_admin(user)

        return Response({
                "message": "User logged in successfully",
                "tokens": tokens,
            }, status=status.HTTP_200_OK)