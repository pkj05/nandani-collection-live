from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Order

@receiver(pre_save, sender=Order)
def track_status_change(sender, instance, **kwargs):
    if instance.id:
        try:
            instance._previous_status = Order.objects.get(id=instance.id).status
        except Order.DoesNotExist:
             instance._previous_status = None
    else:
        instance._previous_status = None

@receiver(post_save, sender=Order)
def update_inventory_on_return(sender, instance, created, **kwargs):
    # Check agar status 'returned' hua hai aur pehle nahi tha
    if hasattr(instance, '_previous_status') and \
       instance._previous_status != 'returned' and \
       instance.status == 'returned':
        
        for item in instance.items.all():
            if item.size_variant:
                # 1. SizeVariant ka stock badhao
                item.size_variant.stock += item.quantity
                item.size_variant.save()
                
                # 2. Agar Suit/Saree hai (FREE size), toh Variant ka stock bhi badhao
                if item.size_variant.size == 'FREE':
                    item.size_variant.variant.stock += item.quantity
                    item.size_variant.variant.save()