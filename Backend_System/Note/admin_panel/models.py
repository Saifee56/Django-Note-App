from django.db import models
from django.contrib.auth.models import User

class UserActivity(models.Model):
    ACTIVITY_CHOICES=[
        ('signup','Signup'),
        ('login','Login'),
        ('create_note','Create_Note'),
        ('update_note','Update_Note'),
        ('delete_note','Delete_Note'),
        ('share_note','Share_Note')
    ]
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='activities')
    activity_type=models.CharField(max_length=50,choices=ACTIVITY_CHOICES)
    timestamp=models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name="User Activity"
        verbose_name_plural="User Activities"

    def __str__(self):
        return f"{self.user.username} -{self.activity_type} at {self.timestamp}"
    
