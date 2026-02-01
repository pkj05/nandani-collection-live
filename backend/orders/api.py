from ninja import Router
from .schemas import OrderCreateSchema
from .models import Order, OrderItem
from shop.models import SizeVariant
from django.db import transaction

router = Router()

@router.post("/create")
def create_order(request, data: OrderCreateSchema):
    try:
        with transaction.atomic():
            # 1. Order Create Karo
            order = Order.objects.create(
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

                # --- SMART LOOKUP LOGIC ---
                # Step A: Agar Frontend ne Size ID bheja hai (Sabse Accurate)
                if item.size_id:
                    size_var = SizeVariant.objects.select_related('variant__product').get(id=item.size_id)
                
                # Step B: Agar Size ID nahi hai, toh Variant ID + Size se dhundo
                elif item.variant_id:
                     size_var = SizeVariant.objects.select_related('variant__product').get(
                         variant_id=item.variant_id, 
                         size=item.size
                     )
                
                # Step C: Fallback (Agar sirf Product ID hai)
                else:
                    size_var = SizeVariant.objects.select_related('variant__product').filter(
                        variant__product_id=item.product_id,
                        size=item.size,
                        variant__color_name=item.color # Color match karke dhundo
                    ).first()

                if not size_var:
                    raise Exception(f"Product not found: {item.color} - {item.size}")

                # Stock Check
                if size_var.stock < item.quantity:
                    raise Exception(f"Stock Issue: {size_var.variant.product.name} ({size_var.size}) khatam hai.")

                # --- ORDER ITEM SAVE (THE FIX) ---
                OrderItem.objects.create(
                    order=order,
                    size_variant=size_var,
                    product_name=size_var.variant.product.name,
                    
                    # ✅ FIX: Database ki price nahi, Frontend ki price use karo
                    price=item.price if item.price > 0 else size_var.variant.product.base_price,
                    
                    quantity=item.quantity,
                    
                    # ✅ FIX: Frontend ka bheja hua Color text use karo
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

            return {"success": True, "order_id": order.id}
            
    except SizeVariant.DoesNotExist:
        return {"success": False, "message": "Selected item variant not found. Please refresh cart."}
    except Exception as e:
        return {"success": False, "message": str(e)}