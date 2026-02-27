from ninja import Schema
from typing import Optional
from datetime import datetime

class ReviewOut(Schema):
    id: int
    user_id: int  # ✅ FIX: Frontend ko 'Edit' button dikhane ke liye user_id ki zarurat thi
    user_name: str
    rating: int
    comment: Optional[str]
    is_verified_buyer: bool
    image_1: Optional[str]
    image_2: Optional[str]
    image_3: Optional[str]
    created_at: datetime

    # ✅ FIX 1: Helpful / Like button variables 
    helpful_count: int = 0
    is_liked: bool = False

    # ✅ FIX 2: Location variables (Frontend par "Pankaj, Haryana" dikhane ke liye)
    state: Optional[str] = None
    city: Optional[str] = None

    # ✅ User ka ID nikalne ke liye
    @staticmethod
    def resolve_user_id(obj):
        if hasattr(obj, 'user') and obj.user:
            return obj.user.id
        return None

    @staticmethod
    def resolve_user_name(obj):
        # ✅ IMPORTANT FIX: Direct object field ko chhod kar User model ke andar check kar rahe hain
        user = getattr(obj, 'user', None)
        
        if user:
            # 1. Sabse pehle 'full_name' check karo
            full_name = getattr(user, 'full_name', '')
            if full_name and str(full_name).strip() and "nandani" not in str(full_name).lower():
                return str(full_name).strip()
            
            # 2. Agar nahi mila toh 'first_name' aur 'last_name' check karo
            first_name = getattr(user, 'first_name', '')
            last_name = getattr(user, 'last_name', '')
            if first_name and str(first_name).strip():
                name = str(first_name).strip()
                if last_name and str(last_name).strip():
                    name += f" {str(last_name).strip()}"
                return name
            
            # 3. Agar kuch na mile toh phone ya username check karo
            username = getattr(user, 'username', '')
            if username and str(username).strip() and "nandani" not in str(username).lower():
                return str(username).strip()

        # 4. Agar upar sab fail ho jaye, tabhi purana user_name field dekho (agar wo default nahi hai)
        fallback_name = getattr(obj, 'user_name', '')
        if fallback_name and "nandani" not in str(fallback_name).lower():
            return fallback_name

        # 5. Anth mein sirf 'Customer' bhejo
        return "Customer"

    # ✅ DB se auto total likes nikalne ke liye
    @staticmethod
    def resolve_helpful_count(obj):
        if hasattr(obj, 'likes'):
            return obj.likes.count()
        return 0

    # ✅ User ki state nikalne ke liye (agar User model me save hai)
    @staticmethod
    def resolve_state(obj):
        if hasattr(obj.user, 'state') and obj.user.state:
            return obj.user.state
        return None

    # ✅ User ki city nikalne ke liye
    @staticmethod
    def resolve_city(obj):
        if hasattr(obj.user, 'city') and obj.user.city:
            return obj.user.city
        return None