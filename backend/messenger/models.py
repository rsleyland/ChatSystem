from django.db import models
from account.models import User


class Chat(models.Model):
    name = models.CharField(max_length=128)
    participants = models.ManyToManyField(User, related_name='participants', blank=True)

    def add_participant(self, user):
        self.participants.add(user)
        self.save()

    def remove_participant(self, user):
        self.participants.remove(user)
        self.save()

    def get_participant_count(self):
        return self.participants.count()
    
    def get_message_count(self):
        return self.messages.count()


class ChatMessage(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="message_from_me")
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    deleted_by = models.ManyToManyField(User, related_name='users_deleted_message', blank=True)



