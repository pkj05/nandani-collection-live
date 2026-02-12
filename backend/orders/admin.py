from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    # Items readonly rakhein taaki record safe rahe
    readonly_fields = ('product_name', 'price', 'quantity', 'size', 'color')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'phone_number', 'total_amount', 'status', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('full_name', 'phone_number', 'id')
    inlines = [OrderItemInline]
    list_editable = ('status',)

# FIX: Yahan se double registration hata diya gaya hai