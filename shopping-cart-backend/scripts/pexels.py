import requests
import os

PEXELS_API_KEY = 'f1WRWvkMfBCCU5HvAYup63Ouxny2Qq9x9o9WC9LNTm5Cc3Fpn3BPxWig'
PEXELS_API_URL = 'https://api.pexels.com/v1/search'

def download_images(query: str, num_images: int, folder: str):
    headers = {'Authorization': PEXELS_API_KEY}
    params = {'query': query, 'per_page': num_images}
    response = requests.get(PEXELS_API_URL, headers=headers, params=params)
    data = response.json()

    if not os.path.exists(folder):
        os.makedirs(folder)

    for idx, photo in enumerate(data['photos']):
        img_url = photo['src']['original']
        img_data = requests.get(img_url).content
        img_filename = f"{query}_{idx+1}.jpg"
        img_path = os.path.join(folder, img_filename)
        
        with open(img_path, 'wb') as f:
            f.write(img_data)
        
        print(f"Downloaded {img_filename} to {folder}")

def download_electronics_images():
    categories = ['laptop', 'mobile', 'tablet', 'headphone', 'camera', 'smartwatch', 'keyboard', 'speaker']
    
    for category in categories:
        download_images(category, 20, f"{category}_images") 

if __name__ == "__main__":
    download_electronics_images()
