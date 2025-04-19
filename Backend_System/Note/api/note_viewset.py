from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .serializers import NoteSerializer,SharedNoteSerializer
from .models import Note,SharedNote
from admin_panel.models import UserActivity

class NoteViewset(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='create')
    def create_note(self, request):
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            UserActivity.objects.create(user=request.user, activity_type='create_note')

            return Response({"message": "Note created successfully", "note": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'], url_path='update')
    def update_note(self, request, pk=None):
        try:
            note = Note.objects.get(pk=pk)
            if note.user != request.user:
                # Check for shared edit access
                shared = SharedNote.objects.filter(note=note, shared_with=request.user, access_type='edit').exists()
                if not shared:
                    return Response({"error": "You do not have permission to edit this note."}, status=status.HTTP_403_FORBIDDEN)
        except Note.DoesNotExist:
            return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = NoteSerializer(note, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            UserActivity.objects.create(user=request.user, activity_type='update_note')
            return Response({"message": "Note updated successfully", "note": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], url_path='delete')
    def delete_note(self, request, pk=None):
        try:
            note = Note.objects.get(pk=pk, user=request.user)
        except Note.DoesNotExist:
            return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)

        note.delete()
        UserActivity.objects.create(user=request.user, activity_type='delete_note')
        return Response({"message": "Note deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='get-all')
    def get_all_notes(self, request):
        user_notes = Note.objects.filter(user=request.user)
        shared_notes = Note.objects.filter(shared_notes__shared_with=request.user)
        all_notes = user_notes | shared_notes
        all_notes = all_notes.distinct()

        serializer = NoteSerializer(all_notes, many=True)
        return Response({"notes": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='detail')
    def get_single_note(self, request, pk=None):
        try:
            # Try owner first
            note = Note.objects.get(pk=pk, user=request.user)
        except Note.DoesNotExist:
            # If not owner, check shared
            try:
                shared_note = SharedNote.objects.get(note_id=pk, shared_with=request.user)
                note = shared_note.note
            except SharedNote.DoesNotExist:
                return Response({"error": "Note not found or access denied"}, status=status.HTTP_404_NOT_FOUND)

        serializer = NoteSerializer(note)
        UserActivity.objects.create(user=request.user, activity_type='view_single_note')
        return Response({"note": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='share')
    def share_note(self, request, pk=None):
        try:
            note = Note.objects.get(pk=pk, user=request.user)
        except Note.DoesNotExist:
            return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data['note'] = note.id

        serializer = SharedNoteSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            UserActivity.objects.create(user=request.user, activity_type='share_note')
            return Response({"message": "Note shared successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)