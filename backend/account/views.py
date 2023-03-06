from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from .serializers import UserWithJwtTokensSerializer, UserSerializer, ProfileSerializer, UserWithProfileSerializer
from .models import User, Profile
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework import status
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class Login(APIView):
    def post(self, request):
        try:
            user = User.objects.get(email=request.data['email'])
            if user.email_confirmed and not user.is_active:
                user.is_active = True
                user.save()
            if not user.is_active: raise Exception("User account is not active")
            serializer = UserWithJwtTokensSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            refresh_token = serializer.validated_data.pop('refresh')
            data = serializer.validated_data
            response = Response()
            response.set_cookie(
                    key = settings.SIMPLE_JWT['AUTH_COOKIE'], 
                    value = refresh_token,
                    expires = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
            response.data = data
            return response
        except Exception as error:
            return Response({'error': str(error) }, status=status.HTTP_400_BAD_REQUEST)


class Register(APIView):
    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = User.objects.create_user(**serializer.validated_data)
            user.send_confirm_email()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as error:
            return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)
        

class Logout(APIView):
    def post(self, request):
        response = Response(status=status.HTTP_200_OK)
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
        return response


class UserUpdate(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        try:
            user = request.user
            data = request.data
            if not user: return Response("User not logged in.", status=status.HTTP_400_BAD_REQUEST)
            first_name = data.get('first_name')
            last_name = data.get('last_name', user.last_name)
            email = data.get('email')
            if User.objects.filter(email=email).exists(): raise Exception("Email is taken.")
            serializer = UserSerializer(user, data={"first_name":first_name, "last_name":last_name, "email":email}, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            if data.get('old_password') and data.get('password'):
                if not user.check_password(request.data['old_password']): return Response("Old password is incorrect.", status=status.HTTP_400_BAD_REQUEST)
                validate_password(request.data['password'], user=user, password_validators=None)
                user.set_password(request.data['password'])
                user.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as error:
            return Response({'password error': list(error)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as error:
            return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)


# update user profile
class UserProfileUpdate(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        try:
            user = request.user
            data = request.data
            if not user: return Response("User not logged in.", status=status.HTTP_400_BAD_REQUEST)
            profile = Profile.objects.get(user=user)
            serializer = ProfileSerializer(profile, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)
    

class GetMyUserProfile(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            user = request.user
            if not user: return Response("User not logged in.", status=status.HTTP_400_BAD_REQUEST)
            profile = Profile.objects.get(user=user)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)


class GetMyUser(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            user = request.user
            if not user: return Response("User not logged in.", status=status.HTTP_400_BAD_REQUEST)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)


class DeactivateMyUser(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        try:
            user = request.user
            if not user: return Response("User not logged in.", status=status.HTTP_400_BAD_REQUEST)
            user.active = False
            return Response("User deactivated.", status=status.HTTP_200_OK)
        except Exception as error:
            return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)



class DeleteMyUser(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request):
        try:
            user = request.user
            if not user: return Response("User not logged in.", status=status.HTTP_400_BAD_REQUEST)
            user.delete()
            return Response("User deleted.", status=status.HTTP_200_OK)
        except Exception as error:
            return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)


class UsersList(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    queryset = User.objects.all()

class UsersWithProfileList(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserWithProfileSerializer
    queryset = User.objects.all()


class ResetPasswordRequest(APIView):
    def post(self, request):
        try:
            user = User.objects.get(email=request.data['email'])
            user.send_reset_password_email()
            print("EMAIL SENT")
            return Response(status=status.HTTP_200_OK)
        except Exception as error:
            return Response({'error': error.messages }, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordVerify(APIView):
    def post(self, request, code):
        try:
            email = request.data.get('email')
            if not email: raise ValidationError("No email provided")
            password = request.data.get('password')
            if not password: raise ValidationError("No password provided")
            user = User.objects.get(email=email)
            if not user: raise ValidationError("No user found")
            if not user.password_reset_code: raise ValidationError("No password reset code found")
            if not user.password_reset_code == code: raise ValidationError("Invalid password reset code")
            validate_password(password, user=user, password_validators=None)
            user.set_password(password)
            user.password_reset_code = User.objects.make_random_password(length=64)
            user.save()
            return Response("Password has been changed.", status=status.HTTP_200_OK)
        except ValidationError as error:
            return Response({'error': error.messages }, status=status.HTTP_400_BAD_REQUEST)

class ConfirmEmail(APIView):
    def post(self, request, code):
        try:
            user = User.objects.get(email_confirmation_code=code)
            if not user: raise ValidationError("No user found")
            user.email_confirmed = True
            user.save()
            return Response("Email has been confirmed.", status=status.HTTP_200_OK)
        except ValidationError as error:
            return Response({'error': error.messages }, status=status.HTTP_400_BAD_REQUEST)