from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from .models import UserActivity

class UserActivityViewSetTests(APITestCase):
    def setUp(self):
        # Create admin and regular user
        self.admin_user = User.objects.create_user(
            username="admin_user", password="adminpass"
        )
        self.admin_user.is_staff = True
        self.admin_user.save()

        self.regular_user = User.objects.create_user(
            username="regular_user", password="userpass"
        )

        # Create some activities
        self.activity1 = UserActivity.objects.create(
            user=self.regular_user,
            activity_type='login'
        )
        self.activity2 = UserActivity.objects.create(
            user=self.admin_user,
            activity_type='signup'
        )

        # APIClient for tests
        self.client = APIClient()

    def test_get_all_activities_as_admin(self):
        # Authenticate as admin
        self.client.force_authenticate(user=self.admin_user)

        url = '/admin_panel/admin-user-activity/all/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return both activities
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 2)
        # Verify that each entry has expected keys
        for entry in response.data:
            self.assertIn('user', entry)
            self.assertIn('activity_type', entry)
            self.assertIn('timestamp', entry)

    def test_get_all_activities_non_admin_forbidden(self):
        # Authenticate as regular user
        self.client.force_authenticate(user=self.regular_user)

        url = '/admin_panel/admin-user-activity/all/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_user_activities_as_admin(self):
        # Authenticate as admin
        self.client.force_authenticate(user=self.admin_user)

        # Fetch activities for regular_user
        url = f'/admin_panel/admin-user-activity/user-activities/{self.regular_user.username}/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return only activity1
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['user'], self.regular_user.username)
        self.assertEqual(response.data[0]['activity_type'], self.activity1.activity_type)

    def test_get_user_activities_non_admin_forbidden(self):
        # Authenticate as regular_user
        self.client.force_authenticate(user=self.regular_user)

        url = f'/admin_panel/admin-user-activity/user-activities/{self.admin_user.username}/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_user_activities_empty(self):
        # New user with no activities
        new_user = User.objects.create_user(username='newuser', password='pass')

        self.client.force_authenticate(user=self.admin_user)
        url = f'/admin_panel/admin-user-activity/user-activities/{new_user.username}/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Expect empty list
        self.assertEqual(response.data, [])