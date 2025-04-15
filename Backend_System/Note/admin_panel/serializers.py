from . models import *
from rest_framework import serializers


class AdminLoginSerializer(serializers.ModelSerializer):
    username=serializers.CharField(required=True)
    password=serializers.CharField(write_only=True,required=True)

    class Meta:
        model=User
        fields=['id','username','password']

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if not username or not password:
            raise serializers.ValidationError("Both username and password are required.")
        return attrs
    

from .models import UserActivity

class UserActivitySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  

    class Meta:
        model = UserActivity
        fields = ['id', 'user', 'activity_type', 'timestamp']
