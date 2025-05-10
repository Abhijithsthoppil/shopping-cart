import api from './api';
import { OrderPayload } from '@pages/CheckoutSuccess';


export const placeOrder = async (payload: OrderPayload) => {
  const res = await api.post("/orders/add", payload);
  return res.data;
};

export const getOrdersByUser = async () => {
  const res = await api.get("/orders");
  return res.data;
};
