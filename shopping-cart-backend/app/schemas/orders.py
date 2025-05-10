# schemas/order.py
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime

class OrderItem(BaseModel):
    product_id: int
    name: str
    qty: int
    price: float

class ShippingInfo(BaseModel):
    fullName: str
    addressLine1: str
    addressLine2: str
    city: str
    postalCode: str
    country: str

class OrderCreate(BaseModel):
    items: List[OrderItem]
    shipping: ShippingInfo
    total_price: float

class OrderOut(OrderCreate):
    order_id: str
    user_id: str
    created_at: datetime
