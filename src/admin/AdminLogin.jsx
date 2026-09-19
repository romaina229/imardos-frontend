import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { apiClient } from '../api/config';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@imardos.org'); // Pré-rempli pour test
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // On envoie la requête vers l'API Laravel sécurisée
      const response = await apiClient.post('/login', { email, password });

      // Laravel renvoie un token : on le transmet au parent qui le conserve (c'est lui qui survit au rechargement)
      onLogin({ token: response.data.token, user: response.data.user });
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError('Email ou mot de passe incorrect.');
      } else if (status === 429 || status === 422) {
        // Trop de tentatives, ou champ invalide : le serveur explique déjà quoi faire
        setError(err.response.data?.message || 'Requête refusée par le serveur.');
      } else {
        setError('Erreur de connexion au serveur.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-imardos-blue">Administration</h2>
          <p className="text-gray-500 text-sm">Connexion sécurisée</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition" 
              placeholder="admin@imardos.org"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input 
              type="password" 
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition" 
              placeholder="Entrez votre mot de passe"
              required
            />
            {error && <p className="text-red-500 text-xs mt-2" role="alert">{error}</p>}
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-imardos-blue hover:bg-blue-800 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="animate-spin" size={20} /> Vérification...</> : 'Accéder au Dashboard'}
          </button>
        </form>
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-500 hover:text-imardos-blue transition-colors">Retour au site</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;