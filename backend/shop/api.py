from ninja import NinjaAPI
from django.shortcuts import get_object_or_404
from typing import List, Optional
from .models import Product, Category, Banner
from .schemas import ProductSchema
from orders.api import router as orders_router

api = NinjaAPI(title="Nandani Collection API")
api.add_router("/orders", orders_router)

@api.get("/banners")
def list_banners(request):
    banners = Banner.objects.filter(is_active=True).order_by('-id')
    return [{"id": b.id, "title": b.title, "image": request.build_absolute_uri(b.image.url)} for b in banners]

@api.get("/categories")
def list_categories(request):
    categories = Category.objects.all()
    return [{"id": c.id, "name": c.name, "image": request.build_absolute_uri(c.image.url) if c.image else None} for c in categories]

@api.get("/products")
def list_products(request, category: Optional[str] = None, search: Optional[str] = None, id: Optional[int] = None, sort: Optional[str] = None):
    # Performance Optimization: select_related se category data ek bar mein aa jayega
    products = Product.objects.filter(is_active=True).select_related('category')
    
    if id: 
        products = products.filter(id=id)
    if category: 
        products = products.filter(category__name__icontains=category)
    if search: 
        products = products.filter(name__icontains=search) | products.filter(description__icontains=search)

    # Sorting Logic
    if sort == "price_low": products = products.order_by('selling_price')
    elif sort == "price_high": products = products.order_by('-selling_price')
    elif sort == "newest": products = products.order_by('-created_at')

    data = []
    for p in products:
        # --- FIXED VARIANT LOGIC ---
        # Is product ke same group_id wale baki colors nikalna
        variants_data = []
        if p.group_id:
            # group_id match hona chahiye aur current product id exclude honi chahiye
            variants = Product.objects.filter(group_id=p.group_id, is_active=True).exclude(id=p.id)
            for v in variants:
                variants_data.append({
                    "id": v.id,
                    "color_name": v.color_name,
                    "thumbnail": request.build_absolute_uri(v.thumbnail.url) if v.thumbnail else None,
                    "stock": v.stock
                })

        data.append({
            "id": p.id, 
            "name": p.name, 
            "category_name": p.category.name,
            "description": p.description, 
            "original_price": p.original_price,
            "selling_price": p.selling_price, 
            "sku": p.sku, 
            "stock": p.stock,
            "color": p.color, 
            "color_name": p.color_name,
            "size": p.size, 
            "has_size": p.category.has_size, # Category level flag
            "fabric": p.fabric,
            "group_id": p.group_id,
            "variants": variants_data, # Ye circles banane ke liye zaroori hai ✅
            "thumbnail": request.build_absolute_uri(p.thumbnail.url) if p.thumbnail else None,
            "video": request.build_absolute_uri(p.video.url) if p.video else None,
            "images": [{"image": request.build_absolute_uri(img.image.url)} for img in p.images.all()]
        })
    return data