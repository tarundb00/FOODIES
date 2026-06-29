import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (data) => {
  try {
    const response = await api.post('/register', data);
    return response;
  } catch (error) {
    throw error;
  }
}

export const login = async (data) => {
  try {
    const response = await api.post('/login', data);
    return response;
  } catch (error) {
    throw error;
  }
}
