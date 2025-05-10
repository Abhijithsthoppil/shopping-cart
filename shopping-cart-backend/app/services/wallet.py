from http.client import HTTPException
import boto3
from decimal import Decimal
from ..schemas.wallet import WalletOut
import os


AWS_DEFAULT_REGION = os.getenv("AWS_DEFAULT_REGION")
dynamodb = boto3.resource('dynamodb', region_name=AWS_DEFAULT_REGION)
wallets_table = dynamodb.Table('wallets')  
def get_wallet_balance(user_id: str) -> WalletOut:
    response = wallets_table.get_item(Key={"user_id": user_id})
    item = response.get("Item")

    if not item:
        wallets_table.put_item(Item={"user_id": user_id, "balance": Decimal("0.0")})
        return WalletOut(user_id=user_id, balance=0.0)

    return WalletOut(user_id=user_id, balance=float(item["balance"]))

def add_funds_to_wallet(user_id: str, amount: float) -> WalletOut:
    amount_decimal = Decimal(str(amount))

    wallets_table.update_item(
        Key={"user_id": user_id},
        UpdateExpression="SET balance = if_not_exists(balance, :zero) + :inc",
        ExpressionAttributeValues={
            ":inc": amount_decimal,
            ":zero": Decimal("0.0"),
        },
    )

    updated = wallets_table.get_item(Key={"user_id": user_id})["Item"]
    return WalletOut(user_id=user_id, balance=float(updated["balance"]))

def deduct_user_wallet(user_id: str, amount: float) -> WalletOut:
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")

    response = wallets_table.get_item(Key={"user_id": user_id})
    wallet = response.get("Item")

    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")

    current_balance = float(wallet.get("balance", 0))
    if amount > current_balance:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    new_balance = Decimal(str(current_balance - amount))

    wallets_table.update_item(
        Key={"user_id": user_id},
        UpdateExpression="SET balance = :b",
        ExpressionAttributeValues={":b": new_balance}
    )

    return WalletOut(user_id=user_id, balance=float(new_balance))