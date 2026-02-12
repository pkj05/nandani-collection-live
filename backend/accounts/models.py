from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Email field ko optional rakhenge kyunki phone login me email nahi hota
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    
    # Provider tracking
    AUTH_PROVIDERS = [
        ('email', 'Email'),
        ('google', 'Google'),
        ('whatsapp', 'WhatsApp'),
        ('phone', 'Phone')
    ]
    auth_provider = models.CharField(max_length=20, choices=AUTH_PROVIDERS, default='email')
    
    # Extra fields for profile
    profile_pic = models.URLField(max_length=500, null=True, blank=True)
    is_verified = models.BooleanField(default=False)

    # ✅ ADDED: Address and Pincode for Checkout Auto-fill Logic
    # Inhe null=True rakha hai taaki login ke waqt koi error na aaye
    address = models.TextField(null=True, blank=True)
    pincode = models.CharField(max_length=10, null=True, blank=True)

    # Login ke liye hum 'username' hi use karenge backend me, 
    # lekin input me email/phone kuch bhi le sakte hain.
    USERNAME_FIELD = 'username' 

    def __str__(self):
        return self.email or self.phone_number or self.username

# OTP store karne ke liye ek alag table
class OTPVerification(models.Model):
    phone_number = models.CharField(max_length=15)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)