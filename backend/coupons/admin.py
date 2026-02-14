from django.contrib import admin
from .models import Coupon

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'coupon_type', 'discount_value', 'active', 'valid_until', 'times_used']
    list_filter = ['active', 'coupon_type', 'valid_until']
    search_fields = ['code']
    actions = ['activate_coupons', 'deactivate_coupons']

    def activate_coupons(self, request, queryset):
        queryset.update(active=True)
    
    def deactivate_coupons(self, request, queryset):
        queryset.update(active=False)