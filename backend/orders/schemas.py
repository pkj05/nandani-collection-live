from ninja import Schema
from typing import List, Optional

class OrderItemSchema(Schema):
    product_id: int
    quantity: int
    size: str
    color: Optional[str] = None

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