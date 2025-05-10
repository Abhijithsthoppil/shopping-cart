import api from './api';

export const login = async (username: string, password: string) => {
  return api.post(
    '/auth/login',
    new URLSearchParams({ username, password })
  );
};

export const getProfile = async () => {
  return api.get('/user/me');
};
