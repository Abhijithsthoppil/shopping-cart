import api from './api'

export interface WalletResponse {
  balance: number;
}

export const getWallet = async (): Promise<WalletResponse> => {
  const response = await api.get('/wallet');
  return response.data;
};

export const addToWallet = async (amount: number): Promise<WalletResponse> => {
  const response = await api.post('/wallet/add', { amount });
  return response.data;
};

export const deductWallet = async (amount: number): Promise<WalletResponse> => {
    const response = await api.post('/wallet/deduct', { amount });
    return response.data;
  };
