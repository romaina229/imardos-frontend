import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/config';
import {
  TOKEN_KEY,
  AUTH_EXPIRED_EVENT,
  getToken,
  getStoredUser,
  saveSession,
  saveUser,
  clearSession,
} from '../utils/auth';

/**
 * Gère la session de l'administrateur.
 *
 * status :
 *  - 'checking'      un token est stocké, on demande au serveur s'il est toujours valide
 *  - 'authenticated' connecté
 *  - 'guest'         non connecté (ou token expiré)
 *  - 'unreachable'   le serveur ne répond pas : on NE déconnecte PAS, le token est peut-être valide
 */
const useAdminAuth = () => {
  const [status, setStatus] = useState(() => (getToken() ? 'checking' : 'guest'));
  const [user, setUser] = useState(() => (getToken() ? getStoredUser() : null));

  const verify = useCallback(async (isCancelled = () => false) => {
    if (!getToken()) {
      setUser(null);
      setStatus('guest');
      return;
    }

    setStatus('checking');
    try {
      const { data } = await apiClient.get('/me');
      if (isCancelled()) return;
      saveUser(data.user);
      setUser(data.user);
      setStatus('authenticated');
    } catch (error) {
      if (isCancelled()) return;
      if (error.response?.status === 401) {
        // Token expiré ou révoqué : retour à l'écran de connexion
        clearSession();
        setUser(null);
        setStatus('guest');
      } else {
        // Panne réseau / serveur : ne pas déconnecter l'utilisateur pour autant
        setStatus('unreachable');
      }
    }
  }, []);

  // Au chargement de la page : valider le token conservé (c'est ce qui évite la déconnexion au rechargement)
  useEffect(() => {
    let cancelled = false;
    if (getToken()) verify(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [verify]);

  useEffect(() => {
    // Une requête quelconque a reçu un 401
    const onExpired = () => {
      setUser(null);
      setStatus('guest');
    };
    // Déconnexion effectuée dans un autre onglet
    const onStorage = (event) => {
      if (event.key === TOKEN_KEY && !event.newValue) {
        setUser(null);
        setStatus('guest');
      }
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const login = useCallback(({ token, user: loggedUser }) => {
    saveSession(token, loggedUser);
    setUser(loggedUser);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    const token = getToken();

    // On déconnecte l'interface tout de suite, sans attendre le serveur
    clearSession();
    setUser(null);
    setStatus('guest');

    // Puis on révoque le token côté serveur (best effort)
    if (token) {
      try {
        await apiClient.post('/logout', null, { headers: { Authorization: `Bearer ${token}` } });
      } catch {
        // Ignoré : la session locale est déjà supprimée, et le token expirera de lui-même
      }
    }
  }, []);

  const updateUser = useCallback((updatedUser) => {
    saveUser(updatedUser);
    setUser(updatedUser);
  }, []);

  return { status, user, login, logout, updateUser, retry: () => verify() };
};

export default useAdminAuth;
