import os
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django_resized import ResizedImageField
from django.core.mail import send_mail



class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name="", password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        if not password:
            raise ValueError('Users must have a password')
        reset_code = User.objects.make_random_password(length=64)
        email_confirmation_code = User.objects.make_random_password(length=64)
        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            password_reset_code=reset_code,
            email_confirmation_code=email_confirmation_code,
            **extra_fields
        )
        try:
            validate_password(password, user=user, password_validators=None)
        except ValidationError as error:
            raise ValidationError({'password': list(error)})

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, password, **extra_fields):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
            first_name=first_name,
            **extra_fields
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.email_confirmed = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=254, unique=True)
    first_name = models.CharField(max_length=254)
    last_name = models.CharField(max_length=254, blank=True, null=True)
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    email_confirmed = models.BooleanField(default=False)
    username = None
    password_reset_code = models.CharField(max_length=64, blank=True, null=True)
    email_confirmation_code = models.CharField(max_length=64, blank=True, null=True)
    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name']

    # make sure everything is lowercase before saving
    def save(self, *args, **kwargs):
        self.email = self.email.lower()
        self.first_name = self.first_name.lower()
        if self.last_name: self.last_name = self.last_name.lower()
        super().save(*args, **kwargs)

    def __str__(self):
        if self.last_name:
            return f"{self.first_name.capitalize()} {self.last_name.capitalize()}"
        return self.first_name.capitalize()
    
    def send_reset_password_email(self):
        try:

            
            html = """\
                    <html>
                    <body>
                        <p>Hi {self.first_name},<br>
                        You have requested to reset your password.</br> Please click link 
                        <a href="http://localhost:3000/reset-password/{self.password_reset_code}/">here</a>
                        to reset your password.<br>
                        </p>
                    </body>
                    </html>
                    """.format(self=self)

            send_mail(
            'Password Recovery Code',
            message = html,
            from_email= os.environ.get("EMAIL_HOST_USER"),
            recipient_list=[self.email],
            fail_silently=False,
            )
        except Exception as e:
            print("Failed to send email:", e)
    
    def send_confirm_email(self):
        try:
            html = """\
                    <html>
                    <body>
                        <p>Hi {self.first_name},<br>
                        You have successfully created an account with us. Please click link 
                        <a href="http://localhost:3000/confirm-email/{self.email_confirmation_code}/">here</a>
                        to confirm your email.<br>
                        </p>
                    </body>
                    </html>
                    """.format(self=self)

            send_mail(
            'Confirm Email',
            message = html,
            from_email= os.environ.get("EMAIL_HOST_USER"),
            recipient_list=[self.email],
            fail_silently=False,
            )
        except Exception as e:
            print("Failed to send email:", e)



class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=254, blank=True, null=True)
    city = models.CharField(max_length=254, blank=True, null=True)
    state = models.CharField(max_length=254, blank=True, null=True)
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    country = models.CharField(max_length=254, blank=True, null=True)
    image = ResizedImageField(force_format='WEBP', size=[300, 300], crop=['middle', 'center'], quality=75, upload_to='profile_pics', blank=True, null=True)

    def __str__(self):
        return self.user.__str__()

