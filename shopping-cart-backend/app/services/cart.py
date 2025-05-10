from app.db import get_table
from boto3.dynamodb.conditions import Key
import uuid
from decimal import Decimal

CART_TABLE_NAME = 'Carts'
PRODUCT_TABLE_NAME = 'Products'

def add_to_cart(user_id: str, product_id: str, quantity: int):
    table = get_table(CART_TABLE_NAME)
    cart_item_id = str(uuid.uuid4())
    response = table.put_item(
        Item={
            'user_id': user_id,
            'cart_item_id': cart_item_id,
            'product_id': product_id,
            'quantity': quantity
        }
    )
    return response


def get_cart_items(user_id: str):
   cart_table = get_table(CART_TABLE_NAME)
   product_table = get_table(PRODUCT_TABLE_NAME)

   cart_response = cart_table.query(
        KeyConditionExpression=Key("user_id").eq(user_id)
   )
   cart_items = cart_response.get("Items", [])

   result = []
   for item in cart_items:
        product_id = Decimal(item["product_id"]);
        product_response = product_table.get_item(Key={"id": product_id})
        product_info = product_response.get("Item")

        if product_info:
            result.append({
                "product": product_info,
                "quantity": item["quantity"]
            })

   return result

def remove_from_cart(user_id: str, product_id: str):
    table = get_table(CART_TABLE_NAME)
    
    response = table.query(
        KeyConditionExpression=Key("user_id").eq(user_id)
    )
    items = response.get("Items", [])

    for item in items:
        if item["product_id"] == product_id:
            table.delete_item(
                Key={
                    "user_id": user_id,
                    "cart_item_id": item["cart_item_id"]
                }
            )
            return True

    return False

def update_cart_item(user_id: str, product_id: str, quantity: int):
    table = get_table(CART_TABLE_NAME)
    
    response = table.query(
        KeyConditionExpression=Key("user_id").eq(user_id)
    )
    items = response.get("Items", [])

    for item in items:
        if item["product_id"] == product_id:
            table.update_item(
                Key={
                    "user_id": user_id,
                    "cart_item_id": item["cart_item_id"]
                },
                UpdateExpression="SET quantity = :q",
                ExpressionAttributeValues={":q": quantity}
            )
            return True

    return False
