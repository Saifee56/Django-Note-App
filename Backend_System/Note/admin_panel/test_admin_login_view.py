from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework import status

class AdminLoginViewSetTests(APITestCase):

    def setUp(self):
        self.admin_user = User.objects.create_user(
            username="admin_user",
            password="adminpass123",
            is_staff=True 
        )
        self.normal_user = User.objects.create_user(
            username="regular_user",
            password="userpass123",
            is_staff=False 
        )

    def test_admin_login_success(self):
        payload = {
            "username": "admin_user",
            "password": "adminpass123"
        }
        response = self.client.post("/admin_panel/admin-login/login-admin/", payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("tokens", response.data)
        self.assertIn("access", response.data["tokens"])
        self.assertIn("refresh", response.data["tokens"])
        self.assertEqual(response.data["message"], "User logged in successfully")

    def test_login_with_invalid_credentials(self):
        payload = {
            "username": "admin_user",
            "password": "wrongpassword"
        }
        response = self.client.post("/admin_panel/admin-login/login-admin/", payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["error"], "Invalid credentials")

    def test_login_with_non_admin_user(self):
        payload = {
            "username": "regular_user",
            "password": "userpass123"
        }
        response = self.client.post("/admin_panel/admin-login/login-admin/", payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data["error"], "You do not have admin privileges")
