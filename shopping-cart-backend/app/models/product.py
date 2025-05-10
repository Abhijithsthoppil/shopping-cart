from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal

class Product(BaseModel):
    id: int
    name: str
    image_url: str
    price: float
    category: str
    brand: str
    description: str

    class Config:
        json_encoders = {
            Decimal: float
        }

class PaginatedProductsResponse(BaseModel):
    products: List[Product]
    last_evaluated_key: Optional[str] = None
