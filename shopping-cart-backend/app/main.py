from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import logging

from app.api.product import product_router
from app.api.auth import auth_router
from app.api.cart import cart_router
from app.api.wallet import wallet_router
from app.api.user import user_router
from app.api.orders import orders_router
from app.api.paytm import paytm_router

app = FastAPI()

logging.basicConfig(level=logging.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth")
app.include_router(product_router, prefix="/api/products")
app.include_router(cart_router, prefix="/api/cart")
app.include_router(wallet_router, prefix="/api/wallet")
app.include_router(user_router, prefix="/api/user")
app.include_router(orders_router, prefix="/api/orders")
app.include_router(paytm_router, prefix="/api/paytm")
