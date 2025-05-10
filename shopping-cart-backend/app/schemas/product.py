from pydantic import BaseModel

# Base schema that is shared by both creating and reading a product
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: str

# Schema for creating a product (inherits from ProductBase)
class ProductCreate(ProductBase):
    pass

# Schema for fetching a product (inherits from ProductBase and adds an 'id' field)
class Product(ProductBase):
    id: int

    class Config:
        orm_mode = True  # Tells Pydantic to treat the data as ORM models
