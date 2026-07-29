import { useState } from 'react';
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
      
      if (response.status === 200) {
        // Si Laravel dit OK, on se connecte !
        onLogin();
      }
    } catch (err) {
      // Si Laravel renvoie une erreur 401
      if (err.response && err.response.status === 401) {
        setError('Email ou mot de passe incorrect.');
      } else {
        setError('Erreur de connexion au serveur.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition" 
              placeholder="Entrez votre mot de passe"
              required
            />
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-imardos-blue hover:bg-blue-800 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="animate-spin" size={20} /> Vérification...</> : 'Accéder au Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;