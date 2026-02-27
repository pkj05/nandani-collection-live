from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name', 'price', 'quantity', 'size', 'color')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # ✅ Invoice number aur location bhi add kar di hai
    list_display = ('invoice_no', 'full_name', 'phone_number', 'total_amount', 'status', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    # Invoice no se bhi search kar payenge ab
    search_fields = ('invoice_no', 'full_name', 'phone_number', 'id')
    inlines = [OrderItemInline]
    list_editable = ('status',)

    # Status badalte waqt asani ho isliye transitions
    fieldsets = (
        ("Order Identification", {'fields': ('invoice_no', 'status')}),
        ("Customer & Shipping", {'fields': ('full_name', 'phone_number', 'email', 'address', 'pincode')}),
        ("Payment Info", {'fields': ('total_amount', 'discount_amount', 'payment_method', 'applied_coupon')}),
        ("Dates", {'fields': ('created_at',)}),
    )
    readonly_fields = ('created_at', 'invoice_no')