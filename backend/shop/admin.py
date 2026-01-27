from django.contrib import admin
from .models import Category, Product, ProductImage, Banner

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'has_size', 'slug']
    list_editable = ['has_size']
    prepopulated_fields = {'slug': ('name',)}

# Gallery photos product ke andar hi dikhengi
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'selling_price', 'stock', 'is_active']
    list_filter = ['category', 'is_active', 'color']
    search_fields = ['name', 'sku', 'supplier']
    inlines = [ProductImageInline] # Gallery yahan handle ho rahi hai
    
    fieldsets = (
        ('Basic Info', {'fields': ('category', 'name', 'description', 'fabric', 'sku', 'supplier')}),
        ('Pricing & Status', {'fields': ('price', 'original_price', 'selling_price', 'stock', 'is_active')}),
        ('Size & Color', {'fields': ('size', 'color', 'color_name', 'group_id')}),
        ('Media', {'fields': ('thumbnail', 'video')}),
    )

    def save_model(self, request, obj, form, change):
        if not obj.category.has_size:
            obj.size = 'FREE'
        super().save_model(request, obj, form, change)

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'link']
    list_editable = ['is_active']

# Yahan se ProductImageAdmin hata diya gaya hai ✅