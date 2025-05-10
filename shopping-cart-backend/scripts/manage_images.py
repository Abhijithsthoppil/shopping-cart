from pexels import download_images
from upload_to_s3 import upload_images_to_s3

categories = [
    'laptop',
    'mobile',
    'tablet',
    'headphone',
    'camera',
    'smartwatch',
    'keyboard',
    'speaker'
]

NUM_IMAGES = 20

def download_and_upload_images():
    for category in categories:
        folder_name = f"{category}_images"

        print(f"Downloading {NUM_IMAGES} images for category: {category}")
        download_images(category, NUM_IMAGES, folder_name)

        print(f"Uploading images from folder: {folder_name} to S3")
        upload_images_to_s3(folder_name)

if __name__ == "__main__":
    download_and_upload_images()
