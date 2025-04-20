from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from admin_panel.models import UserActivity


class UserAuthViewsetTests(APITestCase):

    def setUp(self):
        self.signup_url = '/auth/signup/'
        self.login_url = '/auth/login/'

        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password1': 'testpass123',
            'password2': 'testpass123',
        }

    def test_user_signup_success(self):
        response = self.client.post(self.signup_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("message", response.data)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(UserActivity.objects.filter(activity_type='signup').count(), 1)

    def test_user_signup_missing_field(self):
        invalid_data = self.user_data.copy()
        invalid_data.pop('password1')
        invalid_data.pop('password2')
        response = self.client.post(self.signup_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password1", response.data)
        self.assertIn("password2", response.data)

    def test_user_login_success(self):
        self.client.post(self.signup_url, self.user_data, format='json')

        login_data = {
            "username": self.user_data['username'],
            "password": self.user_data['password1']
        }

        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("tokens", response.data)
        self.assertIn("access", response.data["tokens"])
        self.assertIn("refresh", response.data["tokens"])
        self.assertEqual(UserActivity.objects.filter(activity_type='login').count(), 1)

    def test_user_login_invalid_credentials(self):
        response = self.client.post(self.login_url, {
            "username": "nonexistent",
            "password": "wrongpass"
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)
