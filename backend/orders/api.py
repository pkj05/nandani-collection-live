from ninja import Router, Schema
from typing import List, Optional
from .schemas import OrderCreateSchema, OrderOutSchema 
from .models import Order, OrderItem
from shop.models import SizeVariant
from coupons.models import Coupon # ✅ Coupon model import kiya
from django.db import transaction, models
from django.contrib.auth import get_user_model
from ninja_jwt.authentication import JWTAuth 
from decimal import Decimal
import datetime # ✅ Invoice no generate karne ke liye

User = get_user_model()
router = Router()

# ✅ Error/Success Messages ke liye schema
class MessageSchema(Schema):
    success: bool
    message: str

# --- 1. POST: Create Order (Guest & Login dono ke liye) ---
@router.post("/create", response={200: dict, 400: MessageSchema, 404: MessageSchema})
def create_order(request, data: OrderCreateSchema):
    try:
        with transaction.atomic():
            # --- GUEST CHECKOUT LOGIC (AUTO-SYNC) ---
            user_instance = None
            if data.phone_number:
                user_instance = User.objects.filter(phone_number=data.phone_number).first()

            # --- COUPON VALIDATION & CALCULATION (NEW) ---
            coupon_instance = None
            final_discount = Decimal('0.00')
            
            # Agar frontend se coupon_code aaya hai (Schema me coupon_code field hona chahiye)
            coupon_code = getattr(data, 'coupon_code', None)
            
            if coupon_code:
                try:
                    coupon = Coupon.objects.get(code__iexact=coupon_code, active=True)
                    is_valid, msg = coupon.is_valid()
                    
                    if is_valid:
                        # Re-calculate discount on backend for security
                        cart_total = Decimal(str(data.total_amount))
                        
                        if cart_total >= coupon.min_order_value:
                            if coupon.coupon_type == 'FLAT':
                                final_discount = coupon.discount_value
                            else: # PERCENTAGE
                                final_discount = (coupon.discount_value / Decimal('100')) * cart_total
                                if coupon.max_discount_amount and final_discount > coupon.max_discount_amount:
                                    final_discount = coupon.max_discount_amount
                            
                            coupon_instance = coupon
                            # Coupon usage count badhao
                            coupon.times_used += 1
                            coupon.save()
                except Coupon.DoesNotExist:
                    pass # Galat coupon hai toh discount 0 rahega

            # 1. Order Create Karo
            order = Order.objects.create(
                user=user_instance,
                full_name=data.full_name,
                phone_number=data.phone_number,
                email=data.email,
                address=data.address,
                pincode=data.pincode,
                payment_method=data.payment_method,
                
                # Backend calculation use karein security ke liye
                total_amount=data.total_amount, 
                discount_amount=final_discount, # ✅ Saved backend calculated discount
                applied_coupon=coupon_instance, # ✅ Link coupon model
                
                shipping_charges=data.shipping_charges,
                status='pending'
            )

            # ✅ 1.5 INVOICE NUMBER GENERATION LOGIC (NEW)
            current_year = datetime.date.today().year
            order.invoice_no = f"NC-{current_year}-{order.id:04d}" 
            order.save()

            # ⭐ NEW: AUTO-UPDATE USER PROFILE LOGIC ⭐
            # Agar user logged in hai ya phone se match ho gaya hai
            if user_instance:
                changed = False
                
                # Agar name nahi hai toh update karo
                if not getattr(user_instance, 'full_name', None) or user_instance.full_name.strip() == "":
                    user_instance.full_name = data.full_name
                    changed = True
                
                # Agar state/city/address update karna ho (Models me field hone chahiye)
                if hasattr(user_instance, 'address') and (not user_instance.address or user_instance.address.strip() == ""):
                    user_instance.address = data.address
                    changed = True
                
                if hasattr(user_instance, 'pincode') and (not user_instance.pincode or user_instance.pincode.strip() == ""):
                    user_instance.pincode = data.pincode
                    changed = True

                if changed:
                    user_instance.save()

            # 2. Items Process Karo
            for item in data.items:
                size_var = None

                # --- SMART LOOKUP LOGIC ---
                if hasattr(item, 'size_id') and item.size_id:
                    size_var = SizeVariant.objects.select_related('variant__product').get(id=item.size_id)
                
                elif hasattr(item, 'variant_id') and item.variant_id:
                     size_var = SizeVariant.objects.select_related('variant__product').get(
                         variant_id=item.variant_id, 
                         size=item.size
                     )
                
                else:
                    size_var = SizeVariant.objects.select_related('variant__product').filter(
                        variant__product_id=item.product_id,
                        size=item.size,
                        variant__color_name=item.color
                    ).first()

                if not size_var:
                    raise Exception(f"Product not found: {item.color} - {item.size}")

                # Stock Check
                if size_var.stock < item.quantity:
                    raise Exception(f"Stock Issue: {size_var.variant.product.name} ({size_var.size}) khatam hai.")

                # --- ORDER ITEM SAVE ---
                OrderItem.objects.create(
                    order=order,
                    size_variant=size_var,
                    product_name=size_var.variant.product.name,
                    price=item.price if item.price > 0 else size_var.variant.product.base_price,
                    quantity=item.quantity,
                    size=item.size,
                    color=item.color if item.color else size_var.variant.color_name
                )

                # 3. Inventory Update (Stock Kam Karo)
                size_var.stock -= item.quantity
                size_var.save()

                if size_var.size == 'FREE':
                    size_var.variant.stock -= item.quantity
                    size_var.variant.save()

            return 200, {"success": True, "order_id": order.id, "message": "Order placed successfully"}
            
    except SizeVariant.DoesNotExist:
        return 404, {"success": False, "message": "Selected product variant not found."}
    except Exception as e:
        return 400, {"success": False, "message": str(e)}


# --- 2. GET: My Orders (Logged-in User ke liye) ---
@router.get("/my-orders", response=List[OrderOutSchema], auth=JWTAuth())
def get_my_orders(request):
    user = request.auth 
    phone = str(user.phone_number)
    
    clean_phone_10 = phone[-10:] 
    phone_with_prefix = f"+91{clean_phone_10}"
    
    print(f"--- FETCHING ORDERS FOR: {phone} OR {phone_with_prefix} ---")

    orders = Order.objects.filter(
        models.Q(user=user) | 
        models.Q(phone_number=phone) | 
        models.Q(phone_number=phone_with_prefix) |
        models.Q(phone_number=clean_phone_10)
    ).distinct().order_by('-created_at')

    print(f"--- FOUND {orders.count()} ORDERS ---")
    
    return orders

# ✅ --- 3. GET: Single Order Details ---
@router.get("/{order_id}", response={200: OrderOutSchema, 404: MessageSchema})
def get_order_detail(request, order_id: str):
    try:
        order = Order.objects.get(id=order_id)
        return 200, order
    except Order.DoesNotExist:
        return 404, {"success": False, "message": "Order nahi mila."}
    except ValueError:
        return 400, {"success": False, "message": "Invalid Order ID."}