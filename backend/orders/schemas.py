from ninja import Schema
from typing import List, Optional

class OrderItemSchema(Schema):
    product_id: int      # Parent Product ID
    variant_id: Optional[int] = None # Color ID (Frontend se aa raha hai)
    size_id: Optional[int] = None    # Size ID (Frontend se aa raha hai)
    quantity: int
    size: str
    color: Optional[str] = None # Frontend se color name (e.g. "Red")
    price: Optional[float] = 0.0 # Frontend se price

class OrderCreateSchema(Schema):
    full_name: str
    phone_number: str 
    email: Optional[str] = None
    address: str
    pincode: str
    payment_method: str
    items: List[OrderItemSchema]
    total_amount: float
    shipping_charges: float = 0.0