import json
import logging
from boto3.dynamodb.conditions import Attr
from decimal import Decimal
from typing import Optional, Dict, Any
from fastapi import HTTPException
import boto3
from app.models.product import Product, PaginatedProductsResponse
from dotenv import load_dotenv
import os

load_dotenv()

AWS_DEFAULT_REGION = os.getenv('AWS_DEFAULT_REGION')
dynamodb = boto3.resource('dynamodb', region_name=AWS_DEFAULT_REGION)
table = dynamodb.Table('Products')


def convert_decimals(obj):
    if isinstance(obj, list):
        return [convert_decimals(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return float(obj)
    return obj

from decimal import Decimal, InvalidOperation

def get_users_table():
    return dynamodb.Table("Users")

def get_products_table():
    return dynamodb.Table("Products")

def get_product(
    category: Optional[str] = None,
    limit: int = 20,
    last_evaluated_key: Optional[str] = None
) -> Dict[str, Any]:
    try:
        last_key = None
        if last_evaluated_key:
            parsed = json.loads(last_evaluated_key)
            if 'id' not in parsed:
                raise HTTPException(status_code=400, detail="Missing 'id' in last_key")
            try:
                parsed['id'] = Decimal(str(parsed['id']))
            except InvalidOperation:
                raise HTTPException(status_code=400, detail="Invalid 'id' value in last_key")
            last_key = parsed

        scan_kwargs = {"Limit": limit}

        if last_key:
            scan_kwargs["ExclusiveStartKey"] = last_key

        if category:
            scan_kwargs["FilterExpression"] = Attr("category").eq(category)

        response = table.scan(**scan_kwargs)

        items = convert_decimals(response.get("Items", []))
        last_key = response.get("LastEvaluatedKey")
        last_key = convert_decimals(last_key) if last_key else None

        return {
            "products": items,
            "last_evaluated_key": json.dumps(last_key) if last_key else None
        }

    except Exception as e:
        logging.error(f"Error while fetching products: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
def get_product_by_id_service(product_id: str) -> Optional[Dict[str, Any]]:
    try:
        response = table.get_item(Key={"id": Decimal(product_id)})
        item = response.get("Item")
        if item:
            return convert_decimals(item)
        return None
    except Exception as e:
        logging.error(f"Error fetching product by ID: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch product")


def get_related_products(category: str, exclude_id: str, limit: int = 10) -> list:
    try:
        scan_kwargs = {
            "FilterExpression": Attr("category").eq(category) & Attr("id").ne(Decimal(exclude_id)),
            "Limit": limit
        }
        response = table.scan(**scan_kwargs)
        return convert_decimals(response.get("Items", []))[:4]
    except Exception as e:
        logging.error(f"Error fetching related products: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch related products")
