from http.client import HTTPException
from fastapi import APIRouter, Depends
from ..schemas.orders import OrderCreate, OrderOut
from ..services.orders import save_order, get_orders_by_user
from app.dependencies.auth import get_current_user
from typing import List

orders_router = APIRouter()

@orders_router.post("/add", response_model=OrderOut)
def place_order(order: OrderCreate, current_user: str = Depends(get_current_user)):
    return save_order(order, current_user)

@orders_router.get("/", response_model=List[OrderOut])
def get_user_orders(current_user: str = Depends(get_current_user)):
    return get_orders_by_user(current_user)