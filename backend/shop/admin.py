from django.contrib import admin
from .models import Category, Product, ProductImage, Banner

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'selling_price', 'sku', 'is_active']
    list_filter = ['category', 'has_size', 'is_active']
    list_editable = ['selling_price', 'is_active']
    inlines = [ProductImageInline]
    fieldsets = (
        ('Basic Info', {'fields': ('category', 'name', 'description', 'fabric', 'sku', 'supplier')}),
        ('Pricing', {'fields': ('price', 'original_price', 'selling_price', 'stock', 'is_active')}),
        ('Variants', {'fields': ('group_id', 'color', 'color_name', 'has_size', 'size', 'thumbnail', 'video')}),
    )

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active']
    list_editable = ['is_active']