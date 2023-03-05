from .models import User, Profile
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

#Profile serializer
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["phone", "address", "city", "state", "country", "zip_code", "image"]


# User serializer to convert user model to json
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "password", "first_name", "last_name", "is_active", "is_admin", "is_staff"]
        extra_kwargs = {'password': {'write_only': True}}

# User serializer to convert user model to json
class UserWithProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = User
        fields = ["id", "email", "password", "first_name", "last_name", "is_active", "is_admin", "is_staff", "profile"]
        extra_kwargs = {'password': {'write_only': True}}
    


# Will Handle login using jwt tokens
class UserWithJwtTokensSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get('email', '')
        filtered_user_by_email = User.objects.filter(email=email)
        if not filtered_user_by_email.exists(): # if user does not exist
            raise AuthenticationFailed(detail='Invalid credentials')

        if not filtered_user_by_email[0].is_active:  # if user is not active
            raise AuthenticationFailed(
                'Account not active, please check your email')
        try:
            data = super().validate(attrs)  #returns the tokens
        except AuthenticationFailed as e:
            print(e)
            raise AuthenticationFailed(detail='Invalid credentials')
        
        serializer = UserSerializer(self.user).data
        for k, v in serializer.items():   #add user data to the tokens
            data[k] = v

        return data 

