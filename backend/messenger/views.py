from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from account.models import User
from account.serializers import UserSerializer, UserWithProfileSerializer
from .models import Chat
from .serializers import ChatSerializer
from django.db.models import Q


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    try:
        user = request.user

        users = User.objects.filter(~Q(id=user.id))
        serializer = UserWithProfileSerializer(users, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"detail": "{}".format(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_chat(request):
    try:
        user = request.user
        data = request.data
        friend_id = data.get("friend_id")
        friend = User.objects.get(id=friend_id)

        chats = Chat.objects.all()
        chat = None
        already_exists = False
        for c in chats:
            participants = c.participants.all()
            if len(participants) > 2: continue
            if (user in participants and friend in participants):
                already_exists = True
                chat = c

        if already_exists:
            serializer = ChatSerializer(chat, context={'user_id': user.id})
            return Response(serializer.data, status=status.HTTP_200_OK)

        chat = Chat.objects.create()
        chat.name = "chat_"+str(chat.id)
        chat.participants.add(user)
        chat.participants.add(friend)
        chat.save()
        serializer = ChatSerializer(chat, context={'user_id': user.id})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": "{}".format(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_group_chat(request):
    try:
        user = request.user
        data = request.data
        friend_ids = data.get("friend_ids")
        friends = User.objects.filter(id__in=friend_ids)

        chats = Chat.objects.all()
        chat = None
        already_exists = False
        for c in chats:
            participants = c.participants.all()
            
            if len(participants) < 3: continue
            if (user in participants and set(friends).issubset(participants) and len(participants) == len(set(friends))+1):
                already_exists = True
                chat = c

        if already_exists:
            serializer = ChatSerializer(chat, context={'user_id': user.id})
            return Response(serializer.data, status=status.HTTP_200_OK)

        chat = Chat.objects.create()
        chat.name = "chat_"+str(chat.id)
        chat.participants.add(user)
        for friend in friends:
            chat.participants.add(friend)
        chat.save()
        serializer = ChatSerializer(chat, context={'user_id': user.id})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": "{}".format(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_chats(request):
    try:
        user = request.user
        chats_with_messages = []
        chats = Chat.objects.filter(participants=user)
        for c in chats:
            msg_count = c.get_message_count()
            if msg_count > 0:
                chats_with_messages.append(c)

        serializer = ChatSerializer(
            chats_with_messages, many=True, context={'user_id': user.id})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": "{}".format(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_chat_read(request):
    try:
        user = request.user
        data = request.data
        chat_name = data.get("chat_name")
        chat = Chat.objects.get(name=chat_name)
        if user not in chat.participants.all():
            raise Exception
        messages = chat.messages.all()
        for msg in messages:
            if msg.from_user != user:
                msg.read = True
                msg.save()

        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": "{}".format(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_chat(request):
    try:
        user = request.user
        data = request.data
        chat_name = data.get("chat_name")
        chat = Chat.objects.get(name=chat_name)
        if user not in chat.participants.all():
            raise Exception
        messages = chat.messages.all()
        for msg in messages:
            msg.deleted_by.add(user)
            msg.save()

        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": "{}".format(e)}, status=status.HTTP_400_BAD_REQUEST)
