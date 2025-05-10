from pydantic import BaseModel
from typing import List

class CartAddRequest(BaseModel):
    product_id: int
    quantity: int

class CartItem(BaseModel):
    product_id: int
    quantity: int

class CartResponse(BaseModel):
    items: List[CartItem]
