from ninja import Schema
from typing import List, Optional

# 1. Product ki extra photos ke liye
class ProductImageSchema(Schema):
    image: str  # Sirf photo ka link jayega

# 2. Product ki details (Jo customer ko dikhegi)
class ProductSchema(Schema):
    id: int
    name: str
    category_name: str  # Hum ID nahi, Category ka naam bhejenge (Suits)
    description: str
    original_price: int
    selling_price: int
    # Discount hum calculate karke bhejenge (Optional logic later)
    sku: str
    stock: int
    color: str
    size: str
    thumbnail: str
    # List of extra images
    images: List[ProductImageSchema] 
    
    # Note: Humne 'supplier' yahan nahi likha, to wo frontend par nahi jayega. ✅