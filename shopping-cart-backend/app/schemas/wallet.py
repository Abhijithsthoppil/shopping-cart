from pydantic import BaseModel

class WalletOut(BaseModel):
    balance: float

class WalletTopUp(BaseModel):
    amount: float
