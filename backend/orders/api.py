from ninja import Router, Schema
from typing import List
from .schemas import OrderCreateSchema, OrderOutSchema 
from .models import Order, OrderItem
from shop.models import SizeVariant
from django.db import transaction, models
from django.contrib.auth import get_user_model
from ninja_jwt.authentication import JWTAuth 

User = get_user_model()
router = Router()

# ✅ Error/Success Messages ke liye schema
class MessageSchema(Schema):
    success: bool
    message: str

# --- 1. POST: Create Order (Guest & Login dono ke liye) ---
# response me 200, 400, aur 404 define kiye hain taaki ConfigError na aaye
@router.post("/create", response={200: dict, 400: MessageSchema, 404: MessageSchema})
def create_order(request, data: OrderCreateSchema):
    try:
        with transaction.atomic():
            # --- GUEST CHECKOUT LOGIC (AUTO-SYNC) ---
            # Phone number ke hisab se user dhundo ya guest user ki tarah handle karo
            user_instance = None
            if data.phone_number:
                # Agar phone number se user pehle se hai, toh order usse link kar do
                user_instance = User.objects.filter(phone_number=data.phone_number).first()

            # 1. Order Create Karo
            order = Order.objects.create(
                user=user_instance, # ✅ Link to user if exists
                full_name=data.full_name,
                phone_number=data.phone_number,
                email=data.email,
                address=data.address,
                pincode=data.pincode,
                payment_method=data.payment_method,
                total_amount=data.total_amount,
                shipping_charges=data.shipping_charges,
                discount_amount=0,
                status='pending'
            )

            # 2. Items Process Karo
            for item in data.items:
                size_var = None

                # --- SMART LOOKUP LOGIC (As provided by you) ---
                # Step A: Frontend ne Size ID bheja hai
                if hasattr(item, 'size_id') and item.size_id:
                    size_var = SizeVariant.objects.select_related('variant__product').get(id=item.size_id)
                
                # Step B: Variant ID + Size lookup
                elif hasattr(item, 'variant_id') and item.variant_id:
                     size_var = SizeVariant.objects.select_related('variant__product').get(
                         variant_id=item.variant_id, 
                         size=item.size
                     )
                
                # Step C: Fallback (Product ID + Color + Size)
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
                    
                    # Frontend ki price use karo (Taaki coupon/discounted price save ho)
                    price=item.price if item.price > 0 else size_var.variant.product.base_price,
                    
                    quantity=item.quantity,
                    
                    # Metadata handling
                    size=item.size,
                    color=item.color if item.color else size_var.variant.color_name
                )

                # 3. Inventory Update (Stock Kam Karo)
                size_var.stock -= item.quantity
                size_var.save()

                # Agar 'FREE' size hai (Suit/Saree), toh Master Variant ka stock bhi kam karo
                if size_var.size == 'FREE':
                    size_var.variant.stock -= item.quantity
                    size_var.variant.save()

            return 200, {"success": True, "order_id": order.id, "message": "Order placed successfully"}
            
    except SizeVariant.DoesNotExist:
        return 404, {"success": False, "message": "Selected product variant not found."}
    except Exception as e:
        # Django automatically rolls back transaction on exception
        return 400, {"success": False, "message": str(e)}


# --- 2. GET: My Orders (Logged-in User ke liye) ---
@router.get("/my-orders", response=List[OrderOutSchema], auth=JWTAuth())
def get_my_orders(request):
    """
    लॉगिन यूजर के फोन नंबर या यूजर आईडी से जुड़े सभी ऑर्डर्स फेच करेगा।
    """
    user = request.auth 
    phone = str(user.phone_number)
    
    # ✅ Robust Format Check: Phone number ko 10 digit me convert karke dono format check karna
    # Agar phone number +91 ke bina hai to prefix add karein
    clean_phone_10 = phone[-10:] # Last 10 digits
    phone_with_prefix = f"+91{clean_phone_10}"
    
    # DEBUG: Terminal me check karne ke liye (python manage.py runserver window me dekhein)
    print(f"--- FETCHING ORDERS FOR: {phone} OR {phone_with_prefix} ---")

    orders = Order.objects.filter(
        models.Q(user=user) | 
        models.Q(phone_number=phone) | 
        models.Q(phone_number=phone_with_prefix) |
        models.Q(phone_number=clean_phone_10)
    ).distinct().order_by('-created_at')

    print(f"--- FOUND {orders.count()} ORDERS ---")
    
    return orders