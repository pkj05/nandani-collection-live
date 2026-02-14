from ninja import Router, Schema
from django.shortcuts import get_object_or_404
from .models import Coupon, WheelUsage  # WheelUsage add kiya gaya hai
from decimal import Decimal
from django.utils import timezone
import random
from typing import List, Optional

router = Router()

# ==========================================
# 1. SCHEMAS
# ==========================================

class CouponApplySchema(Schema):
    code: str
    cart_total: float

class CouponResponseSchema(Schema):
    success: bool
    message: str
    discount_amount: float = 0
    final_total: float = 0
    coupon_code: str = None

# --- Wheel Schemas ---
class WheelItemOut(Schema):
    id: int
    label: str
    color: str

# Order ID lene ke liye schema update kiya
class SpinResultIn(Schema):
    order_id: str

class SpinResultOut(Schema):
    success: bool
    coupon_code: Optional[str] = None
    message: str
    discount_text: Optional[str] = None
    already_spun: bool = False  # Track karne ke liye ki kya pehle use ho chuka hai

# ==========================================
# 2. VALIDATION API (Cart Checkout Logic)
# ==========================================

@router.post("/validate-coupon", response=CouponResponseSchema)
def validate_coupon(request, data: CouponApplySchema):
    try:
        # 1. कूपन ढूँढें
        coupon = Coupon.objects.get(code__iexact=data.code)
        
        # 2. बेसिक वैलिडिटी चेक करें (Active, Dates, Total Usage)
        is_valid, msg = coupon.is_valid()
        if not is_valid:
            return {"success": False, "message": msg}

        # 3. Minimum Order Value चेक करें
        cart_total_dec = Decimal(str(data.cart_total))
        if cart_total_dec < coupon.min_order_value:
            return {
                "success": False, 
                "message": f"Bhai, kam se kam ₹{coupon.min_order_value} ki shopping karo is coupon ke liye."
            }

        # 4. डिस्काउंट कैलकुलेट करें
        discount = 0
        if coupon.coupon_type == 'FLAT':
            discount = coupon.discount_value
        else: # PERCENTAGE
            discount = (coupon.discount_value / Decimal('100')) * cart_total_dec
            # Max Discount Limit चेक करें
            if coupon.max_discount_amount and discount > coupon.max_discount_amount:
                discount = coupon.max_discount_amount

        # 5. फाइनल कैलकुलेशन
        final_total = float(cart_total_dec - discount)
        if final_total < 0: final_total = 0

        return {
            "success": True,
            "message": "Coupon applied successfully! Enjoy.",
            "discount_amount": float(discount),
            "final_total": final_total,
            "coupon_code": coupon.code
        }

    except Coupon.DoesNotExist:
        return {"success": False, "message": "Galat coupon code hai bhai."}

# ==========================================
# 3. SPIN THE WHEEL APIs (Gamified Logic)
# ==========================================

@router.get("/wheel-items", response=List[WheelItemOut])
def get_wheel_items(request):
    """Wheel par dikhane ke liye labels aur colors fetch karega"""
    now = timezone.now()
    # Sirf wahi coupons uthao jo wheel ke liye mark hain aur valid hain
    active_wheel_coupons = Coupon.objects.filter(
        is_wheel_coupon=True,
        active=True,
        valid_from__lte=now,
        valid_until__gte=now
    )
    
    items = []
    for cp in active_wheel_coupons:
        # Check if daily limit is not reached for the wheel display
        if cp.today_usage_count < cp.daily_global_limit:
            items.append({
                "id": cp.id,
                "label": cp.wheel_label or cp.code,
                "color": cp.wheel_color
            })
    return items

@router.post("/spin-result", response=SpinResultOut)
def get_spin_result(request, data: SpinResultIn):
    """Anti-Refresh Logic: Ek order par sirf ek baar spin allow karega"""
    now = timezone.now()
    today = now.date()

    # 1. Check karein ki kya is Order ID ne pehle spin kiya hai?
    existing_usage = WheelUsage.objects.filter(order_id=data.order_id).first()
    if existing_usage:
        return {
            "success": True,
            "already_spun": True,
            "coupon_code": existing_usage.coupon_won.code,
            "discount_text": existing_usage.coupon_won.wheel_label or existing_usage.coupon_won.code,
            "message": "Bhai, aap is order par pehle hi jeet chuke ho!"
        }

    # 2. Eligible Coupons filter karein (Wheel active + Daily limit bachi ho)
    eligible_coupons = [
        cp for cp in Coupon.objects.filter(
            is_wheel_coupon=True,
            active=True,
            valid_from__lte=now,
            valid_until__gte=now
        ) if cp.today_usage_count < cp.daily_global_limit
    ]

    if not eligible_coupons:
        return {
            "success": False, 
            "message": "Aaj ke saare rewards khatam ho gaye hain. Kal fir try karein!"
        }

    # 3. Weighted Choice (Probability Logic)
    winning_coupon = random.choices(
        eligible_coupons, 
        weights=[cp.win_probability for cp in eligible_coupons], 
        k=1
    )[0]

    # 4. WheelUsage Record banayein (Lock lagane ke liye)
    WheelUsage.objects.create(
        order_id=data.order_id,
        coupon_won=winning_coupon
    )

    # 5. Daily Usage Count Update Karein
    if winning_coupon.last_used_date != today:
        winning_coupon.today_usage_count = 1
    else:
        winning_coupon.today_usage_count += 1
    
    winning_coupon.save()
    
    return {
        "success": True,
        "coupon_code": winning_coupon.code,
        "discount_text": winning_coupon.wheel_label or winning_coupon.code,
        "message": f"🎉 Mubarak ho! Aapne {winning_coupon.wheel_label or winning_coupon.code} jeeta hai!"
    }