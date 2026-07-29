import axios from 'axios';

// Pointez vers votre serveur Laravel (Port 8000 par défaut)
export const API_URL = 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});