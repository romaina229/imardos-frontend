// Gestion de la session admin côté navigateur.
// Le token est conservé dans localStorage : c'est ce qui permet de rester connecté
// après un rechargement de la page (l'état React, lui, est perdu à chaque rechargement).

export const TOKEN_KEY = 'imardos_admin_token';
const USER_KEY = 'imardos_admin_user';

// Événement émis quand le serveur refuse le token (expiré, révoqué, compte supprimé...)
export const AUTH_EXPIRED_EVENT = 'imardos:auth-expired';

// localStorage peut être indisponible (navigation privée stricte, stockage bloqué) :
// dans ce cas on dégrade proprement vers "non connecté" au lieu de planter.
const safe = (fn, fallback = null) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

export const getToken = () => safe(() => localStorage.getItem(TOKEN_KEY));

export const getStoredUser = () =>
  safe(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

export const saveUser = (user) =>
  safe(() => localStorage.setItem(USER_KEY, JSON.stringify(user)));

export const saveSession = (token, user) => {
  safe(() => localStorage.setItem(TOKEN_KEY, token));
  saveUser(user);
};

export const clearSession = () => {
  safe(() => localStorage.removeItem(TOKEN_KEY));
  safe(() => localStorage.removeItem(USER_KEY));
};
