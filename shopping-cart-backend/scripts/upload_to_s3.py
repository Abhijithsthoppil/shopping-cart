import boto3
from dotenv import load_dotenv
import os
from botocore.exceptions import ClientError

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_DEFAULT_REGION = os.getenv('AWS_DEFAULT_REGION')

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_DEFAULT_REGION
)

BUCKET_NAME = 'my-electronics-products'

def file_exists_in_s3(s3_client, bucket_name, s3_key):
    """Check if a file exists in S3."""
    try:
        s3_client.head_object(Bucket=bucket_name, Key=s3_key)
        return True  
    except ClientError:
        return False 

def upload_images_to_s3(folder: str):
    for filename in os.listdir(folder):
        if filename.endswith('.jpg'):
            file_path = os.path.join(folder, filename)
            
            s3_key = f"electronics/{filename}"  
            
        
            if file_exists_in_s3(s3_client, BUCKET_NAME, s3_key):
                print(f"File {filename} already exists in S3. Skipping upload.")
            else:
        
                try:
                    s3_client.upload_file(file_path, BUCKET_NAME, s3_key)
                    print(f"Successfully uploaded {filename} to S3.")
                except ClientError as e:
                    print(f"Failed to upload {filename} to S3: {e}")
