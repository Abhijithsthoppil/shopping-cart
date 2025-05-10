# app/db.py

import boto3
from app.config import settings

# Create a DynamoDB client
dynamodb = boto3.resource(
    "dynamodb",
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_DEFAULT_REGION,
)

def get_table(table_name: str):
    return dynamodb.Table(table_name)
