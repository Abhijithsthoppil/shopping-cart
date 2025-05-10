import axios from 'axios';

const API_URL = 'http://localhost:8000/api/products/';

interface FetchProductsParams {
  category?: string;
  limit?: number;
  lastKey?: string | null;
}

interface AxiosParams {
  category?: string;
  limit?: number;
  last_key?: string | null;
}

export const getProducts = async ({ category, limit = 20, lastKey }: FetchProductsParams) => {
  try {
    const params: AxiosParams = { limit };
    if (category) params.category = category;
    if (lastKey) params.last_key = lastKey;

    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

