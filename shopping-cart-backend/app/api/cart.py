from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from app.services.cart import add_to_cart, get_cart_items, remove_from_cart, update_cart_item
from app.dependencies.auth import get_current_user

cart_router = APIRouter()

class CartItem(BaseModel):
    product_id: str
    quantity: int

@cart_router.post("/add")
async def add_item_to_cart(item: CartItem, current_user: str = Depends(get_current_user)):
    try:
        add_to_cart(current_user, item.product_id, item.quantity)
        return {"message": "Item added to cart"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@cart_router.get("/")
async def get_user_cart(current_user: str = Depends(get_current_user)):
    try:
        cart_items = get_cart_items(current_user)
        return cart_items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@cart_router.delete("/remove/{product_id}")
async def remove_cart_item(product_id: str, current_user: str = Depends(get_current_user)):
    try:
        success = remove_from_cart(current_user, product_id)
        if not success:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"message": "Item removed from cart"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class UpdateCartItem(BaseModel):
    product_id: str
    quantity: int

@cart_router.put("/update")
async def update_cart_quantity(item: UpdateCartItem, current_user: str = Depends(get_current_user)):
    try:
        success = update_cart_item(current_user, item.product_id, item.quantity)
        if not success:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"message": "Quantity updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
