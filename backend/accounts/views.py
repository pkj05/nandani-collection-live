from ninja import Router, Schema
from django.contrib.auth import get_user_model
from ninja_jwt.tokens import RefreshToken
from ninja_jwt.authentication import JWTAuth
from .schemas import SocialAuthSchema, OTPRequestSchema, OTPVerifySchema, TokenSchema
from .models import OTPVerification
from .utils import generate_otp, send_otp_sms
import time # ✅ Unique username ke liye timestamp zaruri hai

User = get_user_model()
router = Router()

# ✅ प्रोफाइल अपडेट के लिए Schema (Untouched)
class ProfileUpdateSchema(Schema):
    full_name: str
    address: str = None
    pincode: str = None
    email: str = None

def get_tokens_for_user(user):
    """
    User के लिए JWT tokens बनाता है और Address/Pincode के साथ 
    डेटा वापस भेजता है ताकि Checkout पर auto-fill काम करे।
    """
    refresh = RefreshToken.for_user(user)
    
    return {
        'access_token': str(refresh.access_token),
        'refresh_token': str(refresh),
        'user_id': user.id,
        'username': user.username,
        'email': user.email or "",
        'user': {
            'id': user.id,
            'full_name': user.get_full_name() or user.username,
            'phone': getattr(user, 'phone_number', ""),
            'address': getattr(user, 'address', ""),
            'pincode': getattr(user, 'pincode', ""),
        }
    }

# --- 1. Google Login Endpoint ---
@router.post("/google", response=TokenSchema)
def google_login(request, data: SocialAuthSchema):
    user, created = User.objects.get_or_create(
        email=data.email,
        defaults={
            'username': data.email.split('@')[0], 
            'auth_provider': 'google', 
            'is_verified': True
        }
    )
    return get_tokens_for_user(user)

# --- 2. Send OTP Endpoint ---
@router.post("/send-otp")
def send_otp(request, data: OTPRequestSchema):
    phone = data.phone_number
    otp = generate_otp()
    
    # Database me OTP save/update karo
    OTPVerification.objects.update_or_create(
        phone_number=phone,
        defaults={"otp_code": otp, "is_used": False}
    )

    print(f"--- 🔐 DEBUG OTP for {phone}: {otp} ---") 

    # Asli SMS Bhejo (Fast2SMS logic)
    sms_sent = send_otp_sms(phone, otp)

    if sms_sent:
        return {"success": True, "message": f"OTP sent successfully"}
    else:
        # Agar SMS fail bhi ho, tab bhi success return karo taaki logs se login ho sake
        return {"success": True, "message": "OTP Generated (Check Logs if SMS fails)"}

# --- 3. Verify OTP Endpoint (✅ CRASH PROOF LOGIC) ---
@router.post("/verify-otp", response=TokenSchema)
def verify_otp(request, data: OTPVerifySchema):
    try:
        # 1. OTP Check karo (Filter use kiya taaki crash na ho)
        record = OTPVerification.objects.filter(
            phone_number=data.phone_number, 
            is_used=False
        ).last()
        
        if not record:
             return 400, {"success": False, "message": "OTP expired or invalid. Resend OTP."}

        if record.otp_code == data.otp_code:
            
            # ✅ STEP 2: Login Logic (Crash Proof)
            # Pehle check karo user exist karta hai ya nahi?
            user = User.objects.filter(phone_number=data.phone_number).first()

            if not user:
                # Agar user nahi hai, to NAYA banao
                # Username conflict se bachne ke liye timestamp logic
                base_username = data.phone_number
                
                # Agar ye username pehle se kisi aur ka hai (rare case), to change kar do
                if User.objects.filter(username=base_username).exists():
                    base_username = f"{data.phone_number}_{int(time.time())}"

                user = User.objects.create(
                    phone_number=data.phone_number,
                    username=base_username,
                    auth_provider='phone',
                    is_verified=True
                )
            
            # 3. OTP ko used mark karo
            record.is_used = True
            record.save()

            return get_tokens_for_user(user)
        
        else:
            return 400, {"success": False, "message": "Invalid OTP code."}

    except Exception as e:
        # Asli error console me print hoga
        print(f"❌ Verify Error: {str(e)}")
        # Frontend ko 500 mat bhejo, user ko batao error hai
        return 500, {"success": False, "message": f"Login Error: {str(e)}"}

# --- 4. Profile Management Endpoints ---

@router.get("/me", auth=JWTAuth())
def get_me(request):
    """प्रोफाइल पेज के लिए करंट यूजर डेटा"""
    user = request.auth
    return {
        "full_name": user.get_full_name() or user.username,
        "phone": str(getattr(user, 'phone_number', "")),
        "address": getattr(user, 'address', ""),
        "pincode": getattr(user, 'pincode', ""),
        "email": user.email or "",
    }

@router.post("/update-profile", auth=JWTAuth())
def update_profile(request, data: ProfileUpdateSchema):
    """डेटाबेस में यूजर प्रोफाइल अपडेट (Address/Pincode/Email)"""
    user = request.auth
    
    if data.full_name:
        user.first_name = data.full_name
    
    user.address = data.address
    user.pincode = data.pincode
    user.email = data.email
    
    user.save()
    return {"success": True, "message": "Profile updated successfully"}