from django.contrib import admin
import nested_admin  # Ye library zaroori hai 3-level hierarchy ke liye
from .models import (
    Category, Banner, Announcement, 
    Product, ProductVariant, ProductImage, SizeVariant
)

# --- 1. Basic Models (Simple Admin) ---
admin.site.register(Announcement)
admin.site.register(Banner)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'has_size', 'slug')
    # Slug automatic banega, par admin me edit karne ke liye ye option hai
    prepopulated_fields = {'slug': ('name',)}

# --- 2. THE MODULAR NESTED STRUCTURE (Asli Power Yahan Hai) ---

# Level 3: Sizes (Grandchild) - Table format mein dikhega
class SizeVariantInline(nested_admin.NestedTabularInline):
    model = SizeVariant
    extra = 1 # By default 1 khali row dikhegi
    readonly_fields = ('sku',) # SKU auto-generate hota hai, isliye readonly
    fields = ('size', 'stock', 'price_adjustment', 'sku')
    classes = ['collapse'] # Thoda clean dikhne ke liye

# Level 3: Variant Gallery (Grandchild) - Images upload karne ke liye
class ProductImageInline(nested_admin.NestedTabularInline):
    model = ProductImage
    extra = 1
    classes = ['collapse']

# Level 2: Color Variants (Child) - Har color ka ek bada box
class ProductVariantInline(nested_admin.NestedStackedInline):
    model = ProductVariant
    extra = 1
    # Yahan hum Sizes aur Images ko Color ke andar jod rahe hain
    inlines = [SizeVariantInline, ProductImageInline] 
    
    # UI Tweaks
    show_change_link = True
    classes = ['collapse'] # Default mein band rahega taaki page lamba na ho

# Level 1: Main Product (Parent)
@admin.register(Product)
class ProductAdmin(nested_admin.NestedModelAdmin):
    list_display = ('name', 'category', 'base_price', 'is_active', 'created_at')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'fabric')
    
    # Isse wo "Inline Adding" feature chalu ho jayega
    inlines = [ProductVariantInline]

# --- 3. Individual Admin (Debugging ke liye) ---
# Agar kabhi seedha Stock check karna ho bina Product khole
@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('product', 'color_name', 'stock')
    search_fields = ('product__name', 'color_name')

@admin.register(SizeVariant)
class SizeVariantAdmin(admin.ModelAdmin):
    list_display = ('variant', 'size', 'stock', 'sku')
    search_fields = ('sku', 'variant__product__name')