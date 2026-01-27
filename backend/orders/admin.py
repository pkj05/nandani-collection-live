from django.contrib import admin
from .models import Order, OrderItem

# Order ke andar ke items ko dikhane ke liye inline class
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0 # Faltu ki khali lines nahi dikhayega
    readonly_fields = ('product_name', 'price', 'quantity', 'size', 'color')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # List view me kya dikhega
    list_display = ('id', 'full_name', 'phone_number', 'total_amount', 'status', 'payment_method', 'created_at')
    
    # Side me filters
    list_filter = ('status', 'payment_method', 'created_at')
    
    # Search bar
    search_fields = ('full_name', 'phone_number', 'id')
    
    # Order ke andar Items ko inline dikhana
    inlines = [OrderItemInline]
    
    # Status ke hisab se colors ya badges (optional feature)
    list_editable = ('status',) # Admin se hi status change kar sakein

admin.site.register(OrderItem)