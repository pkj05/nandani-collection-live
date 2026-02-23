from ninja import Schema
from typing import Optional
from datetime import datetime

class ReviewOut(Schema):
    id: int
    user_name: str
    rating: int
    comment: Optional[str]
    is_verified_buyer: bool
    image_1: Optional[str]
    image_2: Optional[str]
    image_3: Optional[str]
    created_at: datetime

    @staticmethod
    def resolve_user_name(obj):
        # यूजर का फर्स्ट नेम या फोन नंबर दिखाने के लिए (Privacy ke liye number mask kar sakte hain)
        return obj.user.full_name if hasattr(obj.user, 'full_name') and obj.user.full_name else "Nandani Customer"