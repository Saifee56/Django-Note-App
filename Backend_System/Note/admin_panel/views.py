from django.shortcuts import render
from api.models import *
from api.serializers import *
from . models import *
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


class AdminPanelViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['get'], url_path='all-notes')
    def all_notes(self, request):
        users = User.objects.all()
        response_data = []

        for user in users:
            notes = Note.objects.filter(user=user)
            user_notes = NoteSerializer(notes, many=True).data
            response_data.append({
                "username": user.username,
                "notes": user_notes
            })

        return Response(response_data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='notes-by-username/(?P<username>[^/.]+)')
    def notes_by_username(self, request, username=None):
        user = get_object_or_404(User, username=username)
        notes = Note.objects.filter(user=user)
        serializer = NoteSerializer(notes, many=True)

        return Response({
            "username": user.username,
            "notes": serializer.data
        }, status=status.HTTP_200_OK)
    
    @action(detail=True,methods=['delete'],url_path='delete')
    def delete_note(self,request,pk=None):
        try:
            note = Note.objects.get(pk=pk, user=request.user)
        except Note.DoesNotExist:
            return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)

        note.delete()
        UserActivity.objects.create(user=request.user, activity_type='delete_note')

        return Response({"message": "Note deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    