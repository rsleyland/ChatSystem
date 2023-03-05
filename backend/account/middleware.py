from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .models import User
from django.conf import settings


class JwtTokenRefreshMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        
        # Get access and refresh tokens from cookies and headers
        request_cookie = request.COOKIES.get('refresh_token')
        request_header = request.headers.get('Authorization')
        new_refresh_token = None

        # If access token is expired, try to refresh it
        if request_header:
            try:
                token = AccessToken(token=request_header.split()[1])
                auth = JWTAuthentication()
                # check if access token is valid
                auth.authenticate(request)
                print("Valid Access Token")
            except:
                print("Expired/Invalid Access Token")
                if request_cookie:
                    try:
                        token = RefreshToken(token=request_cookie)
                        id = token.get('user_id')
                        user = User.objects.get(id=id)
                        # check if refresh token is valid
                        token.check_exp()
                        new_refresh_token = RefreshToken().for_user(user)
                        new_access_token = new_refresh_token.access_token
                        # if access token is refreshed, set new refresh token in header so authentication will be accepted
                        request.META['HTTP_AUTHORIZATION'] = f'Bearer {new_access_token}'
                        print("Updated Tokens")
                    except:
                        print("Expired/Invalid Refresh Token")

        response = self.get_response(request)

        # If token updated, set new refresh token in cookie and header in response
        if new_refresh_token:
            response.headers['new_access_token'] = new_access_token
            response.set_cookie(
                    key = settings.SIMPLE_JWT['AUTH_COOKIE'], 
                    value = new_refresh_token,
                    expires = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )

        return response