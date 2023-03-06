from channels.db import database_sync_to_async
from .models import Chat, ChatMessage
from .serializers import ChatMessageSerializer, ChatSerializer
from account.models import User
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken
JWT_authenticator = JWTAuthentication()


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.chat_name = self.scope["url_route"]["kwargs"]["name"]


        # CHECK if user token is valid (authenticated)
        try:
            query_params = parse_qs(self.scope["query_string"].decode())
            token = query_params["token"][0]
            JWT_authenticator.get_validated_token(token)
            data = AccessToken(token)
            self.user_id = data["user_id"]
        except:
            return print("Token not valid")


        # Join room layer
        await self.channel_layer.group_add(self.chat_name, self.channel_name)

        # Link consumer with chat db instance
        self.chat = await self.find_chat()

        await self.accept()

        # get and send chat history
        data = await self.get_chat_message_history()
        await self.send(text_data=json.dumps({"messages": data, "type": "send_chat_history"}))

    async def disconnect(self, close_code):
        # Leave room layer
        await self.channel_layer.group_discard(self.chat_name, self.channel_name)

    # Receive message from WebSocket

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        type = text_data_json["type"]
        message = text_data_json["message"]
        sender = text_data_json["sender"]
        user = await self.get_user(sender)
        if not user: return

        if type == "chat_message":
            message = await self.create_chat_message(user, message)

        serializer_data = await self.serialize_chat_message(message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.chat_name, {"type": "send_chat_message",
                             "message": serializer_data}
        )

        
        #send notification
        receiver_id = await self.get_receiver(user)
        notification_group_name = str(receiver_id) + "__notifications"
        await self.channel_layer.group_send(
            notification_group_name, {"type": "send_chats",
                             "chats": "to_be_filled"}
        )

    async def send_chat_message(self, event):
        message = event["message"]
        type = event["type"]

        # Send message to WebSocket [SEND TO WEBSOCKET LAYER]
        await self.send(text_data=json.dumps({"message": message, "type": type}))


    # DB HELPER FUNCS

    @database_sync_to_async
    def find_chat(self):
        return Chat.objects.get(name=self.chat_name)

    @database_sync_to_async
    def get_user(self, id):
        if id == -1: return None
        return User.objects.get(id=id)
    
    @database_sync_to_async
    def get_receiver(self, user):
        serializer = ChatSerializer(self.chat, context={"user_id":user.id})
        return serializer.data['participants'][0]['id']

    @database_sync_to_async
    def create_chat_message(self, user, message):
        return ChatMessage.objects.create(
            from_user=user,
            content=message,
            chat=self.chat
        )
    
    @database_sync_to_async
    def serialize_chat_message(self, message):
        return ChatMessageSerializer(message).data

    @database_sync_to_async
    def get_chat_message_history(self):
        # last 50 messages
        user = User.objects.get(id=self.user_id)
        not_deleted = []
        messages = ChatMessage.objects.filter(
            chat=self.chat).order_by("-timestamp")[0:50]
        for msg in messages:
            if user in msg.deleted_by.all():
                continue
            not_deleted.append(msg)

        serializer = ChatMessageSerializer(not_deleted, many=True)
        return serializer.data







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