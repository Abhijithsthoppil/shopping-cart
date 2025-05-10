import os
import random
import boto3
from dotenv import load_dotenv
from decimal import Decimal

load_dotenv()

BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_DEFAULT_REGION")

dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
rekognition = boto3.client('rekognition', region_name=AWS_REGION)

S3_BASE_URL = f"https://{BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/electronics/"

CATEGORY_IMAGES = {
    "Laptops": [f"laptop_{i}.jpg" for i in range(1, 21)],
    "Mobiles": [f"mobile_{i}.jpg" for i in range(1, 21)],
    "Cameras": [f"camera_{i}.jpg" for i in range(1, 21)],
    "Headphones": [f"headphone_{i}.jpg" for i in range(1, 21)],
    "Tablets": [f"tablet_{i}.jpg" for i in range(1, 21)],
}

TABLE_NAME = "Products"

table = dynamodb.Table(TABLE_NAME)

def get_image_description(image_url):
    try:
        response = rekognition.detect_labels(
            Image={'S3Object': {'Bucket': BUCKET_NAME, 'Name': image_url}},
            MaxLabels=5,
            MinConfidence=80
        )
        
        labels = [label['Name'] for label in response['Labels']]
        description = ", ".join(labels) if labels else "No description available"
        return description
    except Exception as e:
        print(f"Error getting description for image {image_url}: {e}")
        return "Description unavailable"

for i in range(1, 161):
    category = random.choice(list(CATEGORY_IMAGES.keys()))
    image_filename = random.choice(CATEGORY_IMAGES[category])
    image_url = f"electronics/{image_filename}"

    full_image_url = S3_BASE_URL + image_filename

    description = get_image_description(image_url)

    product = {
        'id': i,
        'name': f"Product {i}",
        'description': description,
        'price': Decimal(str(round(random.uniform(100, 1000), 2))),
        'category': category,
        'brand': random.choice(["Sony", "Samsung", "Apple", "HP", "Lenovo", "Canon"]),
        'image_url': full_image_url, 
    }

    try:
        response = table.get_item(Key={'id': i})
        
        if 'Item' in response:
            table.update_item(
                Key={'id': i},
                UpdateExpression="SET #name = :name, description = :description, price = :price, category = :category, brand = :brand, image_url = :image_url",
                ExpressionAttributeNames={
                    '#name': 'name',
                },
                ExpressionAttributeValues={
                    ':name': product['name'],
                    ':description': product['description'],
                    ':price': product['price'],
                    ':category': product['category'],
                    ':brand': product['brand'],
                    ':image_url': product['image_url'],
                }
            )
            print(f"Updated: {product['name']}")
        else:
    
            table.put_item(Item=product)
            print(f"Inserted: {product['name']}")
    except Exception as e:
        print(f"Failed to insert/update {product['name']} due to error: {e}")

print("Finished processing products.")
