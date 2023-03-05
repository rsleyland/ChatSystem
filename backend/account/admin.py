from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Profile
from django import forms


@admin.action(description='Mark selected users as active')
def set_active(modeladmin, request, queryset):
    queryset.update(is_active=True)

@admin.action(description='Mark selected users as inactive')
def set_inactive(modeladmin, request, queryset):
    queryset.update(is_active=False)

class UserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)
    password_reset_code = User.objects.make_random_password(length=64)
    email_confirmation_code = User.objects.make_random_password(length=64)

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'is_active', 'is_admin', 'is_staff', 'is_superuser')

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.password_reset_code = self.password_reset_code
        user.email_confirmation_code = self.email_confirmation_code
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserAdmin(BaseUserAdmin):
    add_form = UserCreationForm
    list_display = ('email', 'first_name', 'is_admin', 'is_active')
    list_filter = ('is_admin','is_active','is_staff','is_superuser')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'password_reset_code', 'email_confirmation_code')}),
        ('Permissions', {'fields': ('is_admin', 'is_staff', 'is_superuser', 'is_active', 'email_confirmed')}),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()
    actions = [set_active, set_inactive]
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'password1', 'password2', 'is_active', 'is_admin', 'is_staff', 'is_superuser'),
        }),
    )

    

admin.site.register(User, UserAdmin)
admin.site.register(Profile)
