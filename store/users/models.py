from django.contrib.auth.models import (
    AbstractUser,
    UserManager,
)
from django.db import models


class User(AbstractUser):
    user_id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=255)
    is_admin = models.BooleanField(default=False)


    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []  # noqa: RUF012

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if self.is_admin:
            self.is_staff = True
            self.is_superuser = True

        if self.is_staff or self.is_superuser:
            self.is_admin = True
        super().save(*args, **kwargs)
