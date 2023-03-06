from django.urls import path
from .views import get_users, create_chat, get_my_chats, set_chat_read, delete_chat, create_group_chat

urlpatterns = [
    path('get-users/', get_users, name="get-users"),
    path('create-chat/', create_chat, name="create-chat"),
    path('create-group-chat/', create_group_chat, name="create-group-chat"),
    path('my-chats/', get_my_chats, name="my-chats"),
    path('set-chat-read/', set_chat_read, name="set-chat-read"),
    path('delete-chat/', delete_chat, name="delete-chat"),
]