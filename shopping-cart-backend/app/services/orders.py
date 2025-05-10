# db/orders.py
import boto3
from uuid import uuid4
from datetime import datetime
from ..schemas.orders import OrderCreate, OrderOut
from typing import List
from boto3.dynamodb.conditions import Key
from decimal import Decimal

import os


AWS_DEFAULT_REGION = os.getenv("AWS_DEFAULT_REGION")

dynamodb = boto3.resource('dynamodb', region_name=AWS_DEFAULT_REGION)
orders_table = dynamodb.Table('Orders')

def save_order(order: OrderCreate, user_id: str) -> OrderOut:
    order_id = str(uuid4())
    created_at = datetime.utcnow().isoformat()

    items = [
        {
            **i.dict(),
            "price": Decimal(str(i.price)),
        }
        for i in order.items
    ]

    item = {
        "order_id": order_id,
        "user_id": user_id,
        "items": items,
        "shipping": order.shipping.dict(),
        "total_price": Decimal(str(order.total_price)),
        "created_at": created_at,
    }

    orders_table.put_item(Item=item)
    return OrderOut(order_id=order_id, user_id=user_id, created_at=created_at, **order.dict())


def get_orders_by_user(user_id: str) -> List[OrderOut]:
    response = orders_table.query(
        IndexName='user_id-index',
        KeyConditionExpression=Key('user_id').eq(user_id)
    )
    return [OrderOut(**item) for item in response.get('Items', [])]
