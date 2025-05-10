import { Product } from '@context/CartContext';
import api from './api';

export interface CartItem {
  product_id: string;
  quantity: number;
}

export interface DynamoCartResponseItem {
    product: Product;
    quantity: number;
  }

export const addToCart = async (item: CartItem) => {
  return api.post('/cart/add', item);
};

export const getCart = async (): Promise<DynamoCartResponseItem[]> => {
  const response = await api.get('/cart');
  return response.data;
};

export const removeFromCart = async (product_id: string) => {
    return api.delete(`/cart/remove/${product_id}`);
};

export const updateCartItem = async (product_id: string, quantity: number) => {
    return api.put(
      '/cart/update',
      { product_id, quantity }
    );
};
  
