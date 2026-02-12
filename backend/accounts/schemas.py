from ninja import Schema
from typing import Optional, Dict, Any

class SocialAuthSchema(Schema):
    email: str
    name: Optional[str] = None
    provider: Optional[str] = 'google'
    token: Optional[str] = None
    password: Optional[str] = None

class OTPRequestSchema(Schema):
    phone_number: str
    channel: str # 'whatsapp' or 'sms'

class OTPVerifySchema(Schema):
    phone_number: str
    otp_code: str

class TokenSchema(Schema):
    access_token: str
    refresh_token: str
    user_id: int
    username: str
    email: Optional[str] = None
    # ✅ Ye extra field zaruri hai taaki backend se user ka details frontend tak pahunch sake
    user: Optional[Dict[str, Any]] = None