from django.conf import settings
from django.db.models.signals import post_save
from .models import Profile


def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)    


post_save.connect(create_profile, sender=settings.AUTH_USER_MODEL)