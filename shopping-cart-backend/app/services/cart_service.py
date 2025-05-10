import boto3
from datetime import datetime
from app.config import settings

dynamodb = boto3.resource(
    'dynamodb', 
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
    region_name=settings.aws_default_region
)

cart_table = dynamodb.Table('Cart')

# Add to cart
def add_to_cart(user_id, product_id, quantity):
    try:
        cart_table.put_item(
            Item={
                'user_id': user_id,
                'product_id': product_id,
                'quantity': quantity,
                'created_at': str(datetime.utcnow())
            }
        )
    except Exception as e:
        raise Exception(f"Error adding item to cart: {str(e)}")

# Get cart items
def get_cart_items(user_id):
    try:
        response = cart_table.query(
            KeyConditionExpression="user_id = :user_id",
            ExpressionAttributeValues={":user_id": user_id}
        )
        return response.get("Items", [])
    except Exception as e:
        raise Exception(f"Error retrieving cart items: {str(e)}")
