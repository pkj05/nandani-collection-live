from ninja import NinjaAPI
from django.shortcuts import get_object_or_404
from typing import List, Optional
from .models import Product, Category, Banner, Announcement, ProductVariant
from .schemas import ProductSchema
from orders.api import router as orders_router

# 1. Main API Instance
api = NinjaAPI(title="Nandani Collection API")

# 2. Orders Router Link (Checkout ke liye)
api.add_router("/orders", orders_router)

# --- HELPER ENDPOINTS ---

@api.get("/announcements")
def list_announcements(request):
    data = Announcement.objects.filter(is_active=True)
    return list(data.values('text', 'link', 'background_color', 'text_color'))

@api.get("/banners")
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

@api.get("/categories")
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
    Ek helper function jo Product Model ko JSON data mein convert karta hai.
    Ye errors ko rokne ke liye try-catch logic use karta hai.
    """
    variants_data = []
    
    # Prefetched variants par loop
    for v in p.variants.all():
        sizes_data = []
        
        # 1. Size Logic (Safety Check)
        if v.sizes.exists():
            for s in v.sizes.all():
                sizes_data.append({
                    "id": s.id,
                    "size": s.size,
                    "stock": s.stock,
                    # Agar adjustment nahi hai to 0 maano
                    "price": float(p.base_price + (s.price_adjustment or 0)),
                    "sku": s.sku or "" 
                })
        
        # 2. Variant Data Pack karna
        variants_data.append({
            "id": v.id,
            "color_name": v.color_name,
            "color_code": v.color_code,
            # Safe Image URL (Agar thumbnail nahi hai to empty string)
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
        "category_name": p.category.name,
        "description": p.description or "",
        "fabric": p.fabric or "",
        "base_price": float(p.base_price),
        "original_price": float(p.original_price) if p.original_price else None,
        "has_size": p.category.has_size,
        "variants": variants_data
    }

# --- PRODUCT ENDPOINTS ---

@api.get("/products", response=List[ProductSchema])
def list_products(request, category: str = None, search: str = None, sort: str = None):
    # Database Optimization (Queries kam karne ke liye)
    products = Product.objects.filter(is_active=True).prefetch_related(
        'variants', 
        'variants__sizes', 
        'variants__images'
    )

    # Filtering Logic
    if category:
        # Slug ya Name dono try karega
        products = products.filter(category__slug__iexact=category) | products.filter(category__name__iexact=category)
    
    if search:
        products = products.filter(name__icontains=search)

    # Sorting Logic
    if sort == 'newest':
        products = products.order_by('-created_at')
    elif sort == 'price_low':
        products = products.order_by('base_price')
    elif sort == 'price_high':
        products = products.order_by('-base_price')

    # Serialize List
    return [serialize_product(request, p) for p in products]

@api.get("/products/{product_id}", response=ProductSchema)
def get_product_detail(request, product_id: int):
    # Single Product Fetch
    p = get_object_or_404(
        Product.objects.prefetch_related('variants', 'variants__sizes', 'variants__images'), 
        id=product_id
    )
    return serialize_product(request, p)