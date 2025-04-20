# admin_panel/tests/test_admin_panel_viewset.py
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Note
from admin_panel.models import UserActivity

class AdminPanelViewSetTests(APITestCase):
    def setUp(self):
        # create one admin and one regular user
        self.admin = User.objects.create_user('admin', password='pass', is_staff=True)
        self.user = User.objects.create_user('jane', password='pass', is_staff=False)

        # make one note for each
        self.admin_note = Note.objects.create(user=self.admin, title="Admin Note", content="secret")
        self.user_note = Note.objects.create(user=self.user, title="Jane's Note", content="hello")

    def _auth_as(self, user):
        self.client.force_authenticate(user=user)

    def test_admin_can_list_all_notes(self):
        self._auth_as(self.admin)
        resp = self.client.get('/admin_panel/admin-panel/all-notes/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # should return a list of two entries
        usernames = { entry['username'] for entry in resp.data }
        self.assertSetEqual(usernames, {'admin', 'jane'})
        # check that each entry has a "notes" list
        for entry in resp.data:
            self.assertIn('notes', entry)
            # ensure note IDs match
            if entry['username']=='admin':
                self.assertEqual(entry['notes'][0]['id'], self.admin_note.id)
            else:
                self.assertEqual(entry['notes'][0]['id'], self.user_note.id)

    def test_admin_can_get_notes_by_username(self):
        self._auth_as(self.admin)
        resp = self.client.get(f'/admin_panel/admin-panel/notes-by-username/{self.user.username}/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['username'], self.user.username)
        self.assertEqual(len(resp.data['notes']), 1)
        self.assertEqual(resp.data['notes'][0]['id'], self.user_note.id)

    def test_admin_delete_own_note(self):
        self._auth_as(self.admin)
        resp = self.client.delete(f'/admin_panel/admin-panel/{self.admin_note.id}/delete/')
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        # note should be gone
        self.assertFalse(Note.objects.filter(pk=self.admin_note.id).exists())
        # activity logged
        self.assertTrue(UserActivity.objects.filter(user=self.admin, activity_type='delete_note').exists())

    def test_admin_cannot_delete_others_note(self):
        self._auth_as(self.admin)
        resp = self.client.delete(f'/admin_panel/admin-panel/{self.user_note.id}/delete/')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)
        # original still exists
        self.assertTrue(Note.objects.filter(pk=self.user_note.id).exists())

    def test_non_admin_cannot_access_any(self):
        self._auth_as(self.user)
        for url in [
            '/admin_panel/admin-panel/all-notes/',
            f'/admin_panel/admin-panel/notes-by-username/{self.user.username}/',
            f'/admin_panel/admin-panel/{self.user_note.id}/delete/'
        ]:
            resp = self.client.get(url) if url.endswith('/') else self.client.delete(url)
            self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)
