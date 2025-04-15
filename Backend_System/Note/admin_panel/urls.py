from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminPanelViewSet
from .admin_login_view import AdminLoginViewSet
from .user_activities import UserActivityViewSet

router = DefaultRouter()
router.register('admin-panel', AdminPanelViewSet, basename='admin-panel')
router.register('admin-login',AdminLoginViewSet,basename='admin-login')
router.register('admin-user-activity',UserActivityViewSet,basename='admin-user-activity')

urlpatterns = [
    path('', include(router.urls)),
]
