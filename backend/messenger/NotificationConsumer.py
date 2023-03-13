from channels.db import database_sync_to_async
from .models import Chat
from .serializers import ChatSerializer
from account.models import User
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken
JWT_authenticator = JWTAuthentication()

class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        # CHECK if user token is valid (authenticated)
        try:
            query_params = parse_qs(self.scope["query_string"].decode())
            self.token = query_params["token"][0]
            JWT_authenticator.get_validated_token(self.token)
            data = AccessToken(self.token)
            self.user_id = data["user_id"]
        except:
            return print("Token not valid")

        await self.accept()

        
        self.notification_group_name = str(self.user_id) + "__notifications"
        await self.channel_layer.group_add(self.notification_group_name, self.channel_name)

        chats = await self.get_chats()
        await self.send(text_data=json.dumps({"chats": chats, "type": "send_chats"}))

        notifications = await self.get_notification_count()
        await self.send(text_data=json.dumps({"notifications": notifications, "type": "send_notification_count"}))


    async def disconnect(self, close_code):
        # Leave room layer
        await self.channel_layer.group_discard(self.notification_group_name, self.channel_name)


    async def send_chats(self, event):
        type = event["type"]
        chats = await self.get_chats()
        notifications = await self.get_notification_count()
        # Send messages to WebSocket [SEND TO WEBSOCKET LAYER]
        await self.send(text_data=json.dumps({"chats": chats, "type": type}))
        await self.send(text_data=json.dumps({"notifications": notifications, "type": "send_notification_count"}))

    @database_sync_to_async
    def get_chats(self):
        user = User.objects.get(id=self.user_id)
        chats = Chat.objects.filter(participants=user)
        chats_to_include = []
        for c in chats:
            # check if all msgs have been deleted, we dont want these chats (but also want it to be able to work again if other user sends a reply)
            all_deleted = True
            for msg in c.messages.all():
                if user not in msg.deleted_by.all(): all_deleted = False
            if all_deleted: continue

            # Check if there are any messages, if not then dont want to return it - user can create new chat and it will be found and used(no dupes)
            msg_count = c.get_message_count()
            if msg_count <= 0 : continue

            chats_to_include.append(c)

        serializer = ChatSerializer(chats_to_include, many=True, context={'user_id': user.id})

        return serializer.data
    

    @database_sync_to_async
    def get_notification_count(self):
        user = User.objects.get(id=self.user_id)
        chats = Chat.objects.filter(participants=user)
        notifcation_count = 0
        for c in chats:
            messages = c.messages.all()
            for msg in messages:
                if msg.from_user != user and msg.read == False:
                    notifcation_count+=1


        return notifcation_count