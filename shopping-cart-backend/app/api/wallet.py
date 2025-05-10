from fastapi import APIRouter, Depends, HTTPException
from ..schemas.wallet import WalletOut, WalletTopUp
from ..services.wallet import get_wallet_balance, add_funds_to_wallet, deduct_user_wallet
from app.dependencies.auth import get_current_user
from pydantic import BaseModel

wallet_router = APIRouter()

class Wallet(BaseModel):
    amount: float

@wallet_router.get("/")
async def get_user_wallet(current_user: str = Depends(get_current_user)):
    try:
        wallet_balance = get_wallet_balance(current_user)
        return wallet_balance
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@wallet_router.post("/add")
async def add_money(item: Wallet, current_user: str = Depends(get_current_user)):
    try:
        add_funds_to_wallet(current_user, item.amount)
        return {"message": "Item added to cart"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@wallet_router.post("/deduct")
def deduct_wallet(item: Wallet, current_user: str = Depends(get_current_user)):
    try:
        deduct_user_wallet(current_user, item.amount)
        return {"message": "Item updated to cart"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    