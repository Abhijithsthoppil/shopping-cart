import api from './api';

interface PaytmInitiateResponse {
  body: { mid: string };
  orderId: string;
  signature: string;
}

export const initiatePaytmPayment = async (amount: number): Promise<PaytmInitiateResponse> => {
  const response = await api.post<PaytmInitiateResponse>("/paytm/initiate", { amount });
  return response.data;
};
