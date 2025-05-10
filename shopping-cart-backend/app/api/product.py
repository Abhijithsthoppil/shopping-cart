from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from app.services.dynamo_client import get_product, get_product_by_id_service, get_related_products
from app.models.product import PaginatedProductsResponse

product_router = APIRouter()

@product_router.get("/", response_model=PaginatedProductsResponse)
def list_products(
    category: Optional[str] = Query(None),
    limit: int = 20,
    skip: int = 0,
    last_key: Optional[str] = None
):
    return get_product(category=category, limit=limit, last_evaluated_key=last_key)

@product_router.get("/{product_id}")
def get_product_with_related(product_id: str):
    product = get_product_by_id_service(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    category = product.get("category")
    related = []
    if category:
        related = get_related_products(category=category, exclude_id=product_id)

    return {
        "product": product,
        "related": related
    }
