from ninja import Router # ✅ NinjaAPI की जगह Router लिया ताकि api_main में जुड़ सके
from django.shortcuts import get_object_or_404
from typing import List, Optional
from .models import Product, Category, Banner, Announcement, ProductVariant
from .schemas import ProductSchema
# ❌ orders_router यहाँ से हटा दिया क्योंकि ये api_main में handle होगा

# 1. Main Router Instance (Ise hi hum api_main me use karenge)
router = Router() # ✅ Iska naam 'router' hi rakhna taaki backend/api_main ise pehchan sake

# --- HELPER ENDPOINTS ---

@router.get("/announcements")
def list_announcements(request):
    data = Announcement.objects.filter(is_active=True)
    return list(data.values('text', 'link', 'background_color', 'text_color'))

@router.get("/banners")
def list_banners(request):
    banners = Banner.objects.filter(is_active=True).order_by('-id')
    return [
        {
            "id": b.id, 
            "title": b.title, 
            "image": request.build_absolute_uri(b.image.url) if b.image else ""
        } 
        for b in banners
    ]

@router.get("/categories")
def list_categories(request):
    categories = Category.objects.all()
    return [
        {
            "id": c.id, 
            "name": c.name, 
            "has_size": c.has_size, 
            "slug": c.slug, 
            "image": request.build_absolute_uri(c.image.url) if c.image else ""
        } 
        for c in categories
    ]

# --- MAIN PRODUCT LOGIC (Safe Mode) ---

def serialize_product(request, p):
    """
    Helper function jo Product Model ko JSON data mein convert karta hai.
    Sare Images ko build_absolute_uri ke saath fix karta hai.
    """
    variants_data = []
    
    for v in p.variants.all():
        sizes_data = []
        
        # 1. Size Logic
        if v.sizes.exists():
            for s in v.sizes.all():
                sizes_data.append({
                    "id": s.id,
                    "size": s.size,
                    "stock": s.stock,
                    "price": float(p.base_price + (s.price_adjustment or 0)),
                    "sku": s.sku or "" 
                })
        
        # 2. Variant Data Pack karna
        variants_data.append({
            "id": v.id,
            "color_name": v.color_name,
            "color_code": v.color_code,
            "thumbnail": request.build_absolute_uri(v.thumbnail.url) if v.thumbnail else "",
            "video": request.build_absolute_uri(v.video.url) if v.video else None,
            "stock": v.stock,
            "images": [
                request.build_absolute_uri(img.image.url) 
                for img in v.images.all() if img.image
            ],
            "sizes": sizes_data
        })

    return {
        "id": p.id,
        "name": p.name,
        "category_name": p.category.name if p.category else "Uncategorized",
        "description": p.description or "",
        "fabric": p.fabric or "",
        "base_price": float(p.base_price),
        "original_price": float(p.original_price) if p.original_price else None,
        "has_size": p.category.has_size if p.category else False,
        "variants": variants_data
    }

# --- PRODUCT ENDPOINTS ---

@router.get("/products", response=List[ProductSchema])
def list_products(request, category: str = None, search: str = None, sort: str = None):
    products = Product.objects.filter(is_active=True).prefetch_related(
        'variants', 
        'variants__sizes', 
        'variants__images'
    )

    if category:
        products = products.filter(category__slug__iexact=category) | products.filter(category__name__iexact=category)
    
    if search:
        products = products.filter(name__icontains=search)

    if sort == 'newest':
        products = products.order_by('-created_at')
    elif sort == 'price_low':
        products = products.order_by('base_price')
    elif sort == 'price_high':
        products = products.order_by('-base_price')

    return [serialize_product(request, p) for p in products]

@router.get("/products/{product_id}", response=ProductSchema)
def get_product_detail(request, product_id: int):
    p = get_object_or_404(
        Product.objects.prefetch_related('variants', 'variants__sizes', 'variants__images'), 
        id=product_id
    )
    return serialize_product(request, p)