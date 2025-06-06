import axios from 'axios';
const apiUrl: string = import.meta.env.VITE_API_URL
const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export default api;
