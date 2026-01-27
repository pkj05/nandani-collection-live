from ninja import NinjaAPI
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
    products = Product.objects.filter(is_active=True)
    if id: products = products.filter(id=id)
    if category: products = products.filter(category__name__icontains=category)
    if search: products = products.filter(name__icontains=search) | products.filter(description__icontains=search)

    if sort == "price_low": products = products.order_by('selling_price')
    elif sort == "price_high": products = products.order_by('-selling_price')
    elif sort == "newest": products = products.order_by('-created_at')

    data = []
    for p in products:
        data.append({
            "id": p.id, "name": p.name, "category_name": p.category.name,
            "description": p.description, "original_price": p.original_price,
            "selling_price": p.selling_price, "sku": p.sku, "stock": p.stock,
            "color": p.color, "size": p.size, "fabric": p.fabric,
            "thumbnail": request.build_absolute_uri(p.thumbnail.url) if p.thumbnail else None,
            "video": request.build_absolute_uri(p.video.url) if p.video else None,
            "images": [{"image": request.build_absolute_uri(img.image.url)} for img in p.images.all()]
        })
    return data