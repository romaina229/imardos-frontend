import axios from 'axios';
import { getToken, clearSession, AUTH_EXPIRED_EVENT } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Joint automatiquement le token de l'admin connecté à chaque requête
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si le serveur refuse le token (expiré, révoqué, compte supprimé), on nettoie la session
// et on prévient l'application pour qu'elle revienne à l'écran de connexion.
// La tentative de connexion elle-même (/login) est exclue : un 401 y veut simplement dire "mauvais mot de passe".
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? '';

    if (status === 401 && !url.includes('/login') && getToken()) {
      clearSession();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }

    return Promise.reject(error);
  }
);
