import os
import traceback
import time
from ninja import Router, Schema
from django.contrib.auth import get_user_model
from django.db import models # ✅ Q objects ke liye
from ninja_jwt.tokens import RefreshToken
from ninja_jwt.authentication import JWTAuth
from .schemas import SocialAuthSchema, TokenSchema

# ✅ Firebase Admin Imports
import firebase_admin
from firebase_admin import auth, credentials

User = get_user_model()
router = Router()

# ---------------------------------------------------------
# ✅ 1. FIREBASE INITIALIZATION (Secure & Auto-Path)
# ---------------------------------------------------------
try:
    if not firebase_admin._apps:
        # Ye logic apne aap backend folder me 'firebase-key.json' dhund lega
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        key_path = os.path.join(BASE_DIR, 'firebase-key.json')
        
        print(f"🔑 Looking for Firebase Key at: {key_path}")
        
        if os.path.exists(key_path):
            cred = credentials.Certificate(key_path)
            firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin SDK Initialized Successfully!")
        else:
            print("❌ ERROR: 'firebase-key.json' file not found in backend folder!")
except Exception as e:
    print(f"⚠️ Firebase Init Error: {e}")


# ---------------------------------------------------------
# ✅ 2. SCHEMAS
# ---------------------------------------------------------
class FirebaseAuthSchema(Schema):
    id_token: str  # Frontend se ye token aayega

class ProfileUpdateSchema(Schema):
    full_name: str
    address: str = None
    pincode: str = None
    email: str = None


# ---------------------------------------------------------
# ✅ 3. HELPER FUNCTIONS & AUTO-SYNC
# ---------------------------------------------------------
def sync_guest_orders_to_user(user):
    """
    ⭐ AUTO-SYNC LOGIC ⭐
    Agar user ka phone number kisi purane order se match hota hai,
    toh wahan se details utha kar profile me bhar do.
    """
    try:
        from orders.models import Order # Import andar rakha taaki circular dependency na aaye
        
        phone = str(user.phone_number)
        clean_phone = phone[-10:] if len(phone) >= 10 else phone
        phone_with_prefix = f"+91{clean_phone}"

        # Is number ke purane sabhi orders nikalo
        past_orders = Order.objects.filter(
            models.Q(phone_number=phone) | 
            models.Q(phone_number=clean_phone) | 
            models.Q(phone_number=phone_with_prefix)
        ).order_by('-created_at')

        latest_order = past_orders.first()

        # Agar order mil gaya toh profile me details chipka do
        if latest_order:
            changed = False
            
            if not user.first_name and getattr(latest_order, 'full_name', None):
                user.first_name = latest_order.full_name
                changed = True
                
            if not getattr(user, 'address', None) and getattr(latest_order, 'address', None):
                user.address = latest_order.address
                changed = True
                
            if not getattr(user, 'pincode', None) and getattr(latest_order, 'pincode', None):
                user.pincode = latest_order.pincode
                changed = True
                
            if not user.email and getattr(latest_order, 'email', None):
                user.email = latest_order.email
                changed = True

            if changed:
                user.save()
                print(f"✅ AUTO-SYNC: Profile auto-filled from Order #{latest_order.id}")

        # ✅ BONUS: In sabhi guest orders ko user account se link kar do
        unlinked_orders = past_orders.filter(user__isnull=True)
        if unlinked_orders.exists():
            linked_count = unlinked_orders.update(user=user)
            print(f"🔗 Linked {linked_count} past guest orders to this account.")

    except Exception as e:
        print(f"⚠️ Sync Error: {e}")


def get_tokens_for_user(user):
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


# ---------------------------------------------------------
# ✅ 4. API ENDPOINTS
# ---------------------------------------------------------

# --- A. GOOGLE LOGIN ---
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


# --- B. FIREBASE PHONE LOGIN (Auto-Sync Added) ---
@router.post("/firebase-login", response={200: TokenSchema, 400: dict, 500: dict})
def firebase_login(request, data: FirebaseAuthSchema):
    try:
        print("🔥 Verifying Firebase Token...")
        
        # 1. Verify Token with Google Server
        try:
            decoded_token = auth.verify_id_token(data.id_token)
            phone_number = decoded_token.get('phone_number')
        except Exception as auth_err:
             print(f"❌ Firebase Token Invalid: {auth_err}")
             return 400, {"success": False, "message": "Invalid or Expired OTP Token"}
             
        if not phone_number:
            return 400, {"success": False, "message": "Token valid but Phone Number missing"}

        print(f"✅ Verified Phone: {phone_number}")

        # 2. Database me User Dhundo ya Banao
        user = User.objects.filter(phone_number=phone_number).first()

        if not user:
            print("ℹ️ User nahi mila, Naya bana rahe hain...")
            # Unique username logic
            base_username = phone_number
            if User.objects.filter(username=base_username).exists():
                base_username = f"{phone_number}_{int(time.time())}"

            user = User.objects.create(
                phone_number=phone_number,
                username=base_username,
                auth_provider='firebase', 
                is_verified=True
            )
        
        # ⭐ 3. CALL AUTO-SYNC LOGIC HERE ⭐
        sync_guest_orders_to_user(user)
        
        # 4. Tokens Return karo
        return 200, get_tokens_for_user(user)

    except Exception as e:
        print(f"❌ LOGIN ERROR: {str(e)}")
        print(traceback.format_exc())
        return 500, {"success": False, "message": f"Login Error: {str(e)}"}


# --- C. GET USER PROFILE ---
@router.get("/me", auth=JWTAuth())
def get_me(request):
    user = request.auth
    return {
        "full_name": user.get_full_name() or user.username,
        "phone": str(getattr(user, 'phone_number', "")),
        "address": getattr(user, 'address', ""),
        "pincode": getattr(user, 'pincode', ""),
        "email": user.email or "",
    }


# --- D. UPDATE PROFILE ---
@router.post("/update-profile", auth=JWTAuth(), response={200: dict, 400: dict, 500: dict})
def update_profile(request, data: ProfileUpdateSchema):
    try:
        user = request.auth
        print(f"👤 DEBUG: Updating Profile for User ID: {user.id}")
        print(f"📦 DATA RECEIVED: {data}")

        # 1. Name Update
        if data.full_name: 
            user.first_name = data.full_name 
        
        # 2. Address & Pincode Update (Safe Check)
        if hasattr(user, 'address'):
            user.address = data.address
        else:
            print("⚠️ WARNING: 'address' field not found in User model")

        if hasattr(user, 'pincode'):
            user.pincode = data.pincode
        else:
             print("⚠️ WARNING: 'pincode' field not found in User model")
        
        # 3. Email Update (Unique Check)
        if data.email:
            email_exists = User.objects.filter(email=data.email).exclude(id=user.id).exists()
            if email_exists:
                print(f"❌ DEBUG: Email {data.email} already taken.")
                return 400, {"success": False, "message": "Email already in use by another account."}
            user.email = data.email

        # 4. Save
        user.save()
        print("✅ DEBUG: Profile Saved Successfully!")
        return 200, {"success": True, "message": "Profile updated successfully"}

    except Exception as e:
        print(f"❌ PROFILE UPDATE ERROR: {str(e)}")
        print(traceback.format_exc())
        return 500, {"success": False, "message": f"Update Failed: {str(e)}"}