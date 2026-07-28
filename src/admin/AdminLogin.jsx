import { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Mot de passe par défaut pour l'admin
    if (password === 'IMARDOS_ADMIN_2024') {
      onLogin();
    } else {
      setError('Mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-imardos-blue">Administration</h2>
          <p className="text-gray-500 text-sm">Connectez-vous pour gérer le contenu</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe Admin</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange focus:border-imardos-orange outline-none transition" 
              placeholder="Entrez le mot de passe"
            />
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>
          <button 
            type="submit" 
            className="w-full bg-imardos-blue hover:bg-blue-800 text-white py-3 rounded-lg font-bold transition-colors"
          >
            Accéder au Tableau de bord
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;