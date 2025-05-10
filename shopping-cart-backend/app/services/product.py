from sqlalchemy.orm import Session
from ..models import product as models
from ..schemas import product as schemas

def get_product(db: Session):
    return db.query(models.Product).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
