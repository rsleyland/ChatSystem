from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('ws/chats/<str:name>/', consumers.ChatConsumer.as_asgi(), name="websocket-chats"),
    path('ws/notifications/', consumers.NotificationConsumer.as_asgi(), name="websocket-notifications"),
]