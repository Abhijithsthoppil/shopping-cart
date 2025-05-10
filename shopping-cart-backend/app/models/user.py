# For DynamoDB, we don't define models like SQLAlchemy, but we can define item structure here.
from app.db import get_table

USER_TABLE_NAME = 'Users'

def get_user_by_username(username: str):
    table = get_table(USER_TABLE_NAME)
    response = table.get_item(Key={'username': username})
    return response.get('Item')  # Returns user if found, else None

def create_user(username: str, email: str, hashed_password: str):
    table = get_table(USER_TABLE_NAME)
    response = table.put_item(Item={
        'username': username,
        'email': email,
        'hashed_password': hashed_password
    })
    return response
