import json
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from api.models import Note, SharedNote

class NoteViewsetTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='pass1234')
        self.user2 = User.objects.create_user(username='user2', password='pass1234')

        self.client.force_authenticate(user=self.user1)

        self.note1 = Note.objects.create(title="Note 1", content="Note 1 content", user=self.user1)
        self.note2 = Note.objects.create(title="Note 2", content="Note 2 content", user=self.user1)

    def test_create_note_success(self):
        payload = {
            "title": "New Note",
            "content": "Note created in test"
        }
        response = self.client.post(
            "/note/create/",
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("note", response.data)

    def test_update_note_by_owner(self):
        payload = {
            "title": "Updated Title"
        }
        response = self.client.put(
            f"/note/{self.note1.pk}/update/",
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['note']['title'], "Updated Title")

    def test_update_note_by_shared_user_with_edit(self):
        SharedNote.objects.create(note=self.note1, shared_with=self.user2, access_type='edit')
        self.client.force_authenticate(user=self.user2)

        payload = {
            "content": "Edited by shared user"
        }
        response = self.client.put(
            f"/note/{self.note1.pk}/update/",
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['note']['content'], "Edited by shared user")

    def test_update_note_by_shared_user_without_edit(self):
        SharedNote.objects.create(note=self.note1, shared_with=self.user2, access_type='view')
        self.client.force_authenticate(user=self.user2)

        payload = {
            "title": "Should Not Update"
        }
        response = self.client.put(
            f"/note/{self.note1.pk}/update/",
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_note_success(self):
        response = self.client.delete(f"/note/{self.note2.pk}/delete/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_note_not_found(self):
        response = self.client.delete("/note/999/delete/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_all_notes(self):
        SharedNote.objects.create(note=self.note1, shared_with=self.user2, access_type='view')
        self.client.force_authenticate(user=self.user2)

        response = self.client.get("/note/get-all/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data["notes"]) >= 1)

    def test_get_single_note_by_owner(self):
        response = self.client.get(f"/note/{self.note1.pk}/detail/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["note"]["id"], self.note1.id)

    def test_get_single_note_by_shared_user(self):
        SharedNote.objects.create(note=self.note1, shared_with=self.user2, access_type='view')
        self.client.force_authenticate(user=self.user2)

        response = self.client.get(f"/note/{self.note1.pk}/detail/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["note"]["id"], self.note1.id)

    def test_get_single_note_not_found(self):
        response = self.client.get("/note/999/detail/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_share_note_success(self):
        payload = {
            "shared_with": self.user2.username, 
            "access_type": "edit" 
        }
        response = self.client.post(
            f"/note/{self.note1.pk}/share/",
            data=json.dumps(payload),
            content_type='application/json'
        )
        print("RESPONSE:", response.data)  
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Note shared successfully")


    def test_share_note_not_found(self):
        payload = {
            "shared_with": self.user2.id,
            "access_type": "view"
        }
        response = self.client.post(
            "/note/999/share/",
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
