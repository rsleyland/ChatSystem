from django.urls import path

from .ChatConsumer import ChatConsumer
from .NotificationConsumer import NotificationConsumer

websocket_urlpatterns = [
    path('ws/chats/<str:name>/', ChatConsumer.as_asgi(), name="websocket-chats"),
    path('ws/notifications/', NotificationConsumer.as_asgi(), name="websocket-notifications"),
]