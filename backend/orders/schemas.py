from ninja import Schema
from typing import List, Optional
from datetime import datetime

# ==========================================
# 1. ORDER OUTPUT SCHEMAS (For Tracking/List)
# ==========================================

class OrderItemOutSchema(Schema):
    """आर्डर के अंदर मौजूद एक-एक आइटम की डिटेल दिखाने के लिए"""
    product_name: str
    price: float
    quantity: int
    size: str
    color: str

class OrderOutSchema(Schema):
    """My Orders लिस्ट और Tracking पेज को डेटा भेजने के लिए"""
    id: int
    full_name: str
    phone_number: str
    address: str
    pincode: str
    payment_method: str
    total_amount: float
    shipping_charges: float
    
    # ✅ Discount Info (Tracking page par dikhane ke liye)
    discount_amount: float = 0.0
    applied_coupon_code: Optional[str] = None # Coupon ka naam dikhane ke liye
    
    status: str
    created_at: datetime
    
    # 👇 ✅ FIXED: Added Optional and None to prevent payment errors 👇
    updated_at: Optional[datetime] = None
    invoice_no: Optional[str] = None
    
    # ✅ ये लाइन लिस्ट दिखाने के लिए सबसे ज़रूरी है
    items: List[OrderItemOutSchema]

# ==========================================
# 2. ORDER INPUT SCHEMAS (For Creation)
# ==========================================

class OrderItemCreateSchema(Schema):
    """चेकआउट के वक्त कार्ट से आने वाला डेटा"""
    product_id: int
    variant_id: Optional[int] = None
    size_id: Optional[int] = None
    quantity: int
    price: float
    size: str
    color: str

class OrderCreateSchema(Schema):
    """चेकआउट फॉर्म से आने वाला पूरा डेटा"""
    full_name: str
    phone_number: str
    email: Optional[str] = None
    address: str
    pincode: str
    payment_method: str
    total_amount: float
    shipping_charges: float
    
    # ✅ Coupon Logic Input
    # Jab user coupon apply karega toh ye code backend pe jayega
    coupon_code: Optional[str] = None 
    
    items: List[OrderItemCreateSchema]

# ==========================================
# 3. UTILITY SCHEMAS (For Error Handling)
# ==========================================

class MessageSchema(Schema):
    """Success या Error मैसेज भेजने के लिए"""
    success: bool
    message: str