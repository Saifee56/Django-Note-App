from rest_framework import serializers
from . models import Note,SharedNote
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content']

class UserSignUpSerializer(serializers.ModelSerializer):
    password1=serializers.CharField(write_only=True,required=True)
    password2=serializers.CharField(write_only=True,required=True)

    class Meta:
        model=User
        fields=['id','username','email','password1','password2']

    def validate(self,attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError({"message":"Passwords do not match"})
        return attrs
    
    def create(self,validated_data):
        user=User(
            username=validated_data['username'],
            email=validated_data.get('email','')


        )
        user.set_password(validated_data['password1'])
        user.save()
        return user
    
class UserLoginSerializer(serializers.ModelSerializer):
    username=serializers.CharField(required=True)
    password=serializers.CharField(write_only=True,required=True)

    class Meta:
        model=User
        fields=['id','username','password']

    def validate(self,attrs):
        username=attrs.get('username')
        password=attrs.get('password')

        if username and password:
            user=authenticate(username=username,password=password)
            if not user:
                raise serializers.ValidationError("Invalid username or password")
            attrs['user']=user
        else:
            raise serializers.ValidationError("Both Username and Password are required")
        
        return attrs
    
class SharedNoteSerializer(serializers.ModelSerializer):
    shared_with = serializers.SlugRelatedField(
        slug_field='username',
        queryset=User.objects.all()
    )
    access_type = serializers.ChoiceField(
        choices=[('view','view'),('edit','edit')]
    )

    class Meta:
        model = SharedNote
        fields = ['note', 'shared_with', 'access_type']

