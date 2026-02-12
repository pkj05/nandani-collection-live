from ninja import Schema
from typing import List, Optional

# 1. Product ki extra photos ke liye (Preserved)
class ProductImageSchema(Schema):
    image: str

# 2. Size aur Stock details ke liye (Naya Logic)
class SizeVariantSchema(Schema):
    id: int
    size: str
    stock: int
    price: float # Base price + Adjustment
    sku: str     # Auto-generated SKU

# 3. Color Variant details (Circles aur Media ke liye)
class VariantSchema(Schema):
    id: int
    color_name: str
    color_code: str
    thumbnail: str
    video: Optional[str] = None # Preserved
    stock: int # Suits/Saree ke liye common stock
    images: List[str] # Gallery links
    sizes: List[SizeVariantSchema] # Size wise details

# 4. Main Product Schema (Jo customer ko dikhega)
class ProductSchema(Schema):
    id: int
    name: str
    category_name: str # Category ID ki jagah naam (e.g. Suits)
    description: str
    fabric: Optional[str] = None # Preserved
    base_price: float # Selling price ka naya naam
    original_price: Optional[float] = None # Preserved
    has_size: bool # Category level flag
    
    # List of Variants (Ab circles aur gallery isi se banegi)
    variants: List[VariantSchema]
    
    # Note: 'supplier' humne yahan bhi nahi rakha, taaki wo frontend par na jaye ✅