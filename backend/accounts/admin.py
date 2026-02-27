from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    # ✅ 1. लिस्ट में जो जरूरी है वही दिखेगा
    # आपके मॉडल में 'full_name' नहीं है, इसलिए हम first_name, last_name और phone_number दिखाएंगे
    list_display = ('phone_number', 'username', 'first_name', 'last_name', 'email', 'auth_provider', 'date_joined', 'is_active')
    
    # ✅ 2. सर्च करने के लिए फील्ड्स
    search_fields = ('phone_number', 'username', 'first_name', 'email')
    
    # ✅ 3. फिल्टर (साइड बार)
    list_filter = ('auth_provider', 'is_active', 'date_joined')
    
    # ✅ 4. एडमिन पैनल में डेटा अरेंज करना
    fieldsets = (
        ("Account Info", {
            'fields': ('username', 'password', 'phone_number', 'auth_provider')
        }),
        ("Personal Details", {
            'fields': ('first_name', 'last_name', 'email', 'profile_pic')
        }),
        ("Shipping Data (Auto-filled)", {
            'fields': ('address', 'pincode')
        }),
        ("Status & Permissions", {
            'fields': ('is_verified', 'is_active', 'is_staff', 'is_superuser')
        }),
        ("Timeline", {
            'fields': ('last_login', 'date_joined')
        }),
    )

    readonly_fields = ('date_joined', 'last_login')
    ordering = ('-date_joined',)

# Optional: OTP table ko bhi admin me dekhne ke liye
from .models import OTPVerification
@admin.register(OTPVerification)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('phone_number', 'otp_code', 'created_at', 'is_used')
    search_fields = ('phone_number',)