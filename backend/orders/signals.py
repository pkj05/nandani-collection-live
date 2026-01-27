from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Order, OrderItem

@receiver(pre_save, sender=Order)
def track_status_change(sender, instance, **kwargs):
    # Purana status check karne ke liye agar order pehle se database me hai
    if instance.id:
        instance._previous_status = Order.objects.get(id=instance.id).status
    else:
        instance._previous_status = None

@receiver(post_save, sender=Order)
def update_inventory_on_return(sender, instance, created, **kwargs):
    # Agar status badalkar 'returned' kiya gaya hai
    if hasattr(instance, '_previous_status') and \
       instance._previous_status != 'returned' and \
       instance.status == 'returned':
        
        # Order ke saare items nikalein
        order_items = instance.items.all()
        for item in order_items:
            if item.product:
                # Product ka stock wapas badha dein
                item.product.stock += item.quantity
                item.product.save()
                print(f"Inventory Updated: {item.product.name} stock increased by {item.quantity}")