from django.urls import path
from .views import Login, Logout, ResetPasswordRequest, ResetPasswordVerify, Register, UserUpdate, UserProfileUpdate, GetMyUserProfile, GetMyUser, \
    DeactivateMyUser, DeleteMyUser, UsersList, UsersWithProfileList, ConfirmEmail

urlpatterns = [
    path('login/', Login.as_view()),
    path('logout/', Logout.as_view()),
    path('register/', Register.as_view()),
    path('update/', UserUpdate.as_view()),
    path('update-profile/', UserProfileUpdate.as_view()),
    path('reset-password/', ResetPasswordRequest.as_view()),
    path('reset-password/<str:code>/', ResetPasswordVerify.as_view()),
    path('profile/', GetMyUserProfile.as_view()),
    # path('user/', GetMyUser.as_view()),
    path('deactivate/', DeactivateMyUser.as_view()),
    path('delete/', DeleteMyUser.as_view()),
    path('users/', UsersList.as_view()),
    path('users-with-profile/', UsersWithProfileList.as_view()),
    path('confirm-email/<str:code>/', ConfirmEmail.as_view()),
]