from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.models import product as models
from app import schemas
from fastapi import HTTPException, status
from typing import List

# Function to get a single product by ID
def get_product(db: Session, product_id: int):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product

# Function to create a new product
def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    try:
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error creating product")
    return db_product

# Function to get multiple products with pagination
def get_product(db: Session, skip: int = 0, limit: int = 100) -> List[schemas.Product]:
    products = db.query(models.Product).offset(skip).limit(limit).all()
    return products

# Optional: Function to get total product count for pagination purposes
def get_product_count(db: Session) -> int:
    return db.query(models.Product).count()
