from ninja import Router
from .schemas import OrderCreateSchema
from .models import Order, OrderItem
from shop.models import Product
from django.db import transaction

router = Router()

@router.post("/create")
def create_order(request, data: OrderCreateSchema):
    try:
        with transaction.atomic():
            # 1. Order create karein
            order = Order.objects.create(
                full_name=data.full_name,
                phone_number=data.phone_number,
                email=data.email,
                address=data.address,
                pincode=data.pincode,
                payment_method=data.payment_method,
                total_amount=data.total_amount,
                shipping_charges=data.shipping_charges,
                status='pending'
            )

            # 2. Items aur Inventory update karein
            for item in data.items:
                product = Product.objects.get(id=item.product_id)
                
                # Check karein ki kya stock hai?
                if product.stock < item.quantity:
                    raise Exception(f"Maafi chahte hain, {product.name} ka stock khatam ho gaya hai.")

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    product_name=product.name,
                    # FIX: 'price' ki jagah 'selling_price' use kiya gaya hai
                    price=product.selling_price, 
                    quantity=item.quantity,
                    size=item.size,
                    color=item.color
                )

                # Stock ghatayein (Inventory Management)
                product.stock -= item.quantity
                product.save()

            return {"success": True, "order_id": order.id, "message": "Order successfully placed!"}

    except Exception as e:
        # Debugging ke liye error message return karein
        return {"success": False, "message": str(e)}