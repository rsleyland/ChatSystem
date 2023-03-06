from rest_framework import serializers
from .models import Chat, ChatMessage
from account.serializers import UserSerializer, UserWithProfileSerializer
from account.models import User


class ChatSerializer(serializers.ModelSerializer):

    participants = serializers.SerializerMethodField(read_only=True)
    messages = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Chat
        fields = '__all__'

    def get_participants(self, obj):
        user_id = self.context['user_id']
        ids = [o.id for o in obj.participants.all() if o.id != user_id]
        accs = User.objects.filter(id__in=ids)
        return UserWithProfileSerializer(accs, many=True).data
    
    
    def get_messages(self, obj):
        messages = obj.messages.all().order_by("-timestamp")[0:50]
        return ChatMessageSerializer(messages, many=True).data
    



class ChatMessageSerializer(serializers.ModelSerializer):

    from_user_name  = serializers.SerializerMethodField(read_only=True)
    deleted_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ChatMessage
        fields = '__all__'


    def get_from_user_name(self, obj):
        return obj.from_user.first_name
    
    def get_deleted_by(self, obj):
        deleted_by =  obj.deleted_by.all()
        return UserWithProfileSerializer(deleted_by, many=True).data