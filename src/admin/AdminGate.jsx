import { Loader2, WifiOff } from 'lucide-react';
import useAdminAuth from './useAdminAuth';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminGate = () => {
  const { status, user, login, logout, updateUser, retry } = useAdminAuth();

  // Un token est stocké : on attend la réponse du serveur avant d'afficher quoi que ce soit,
  // pour ne pas montrer le formulaire de connexion une fraction de seconde après un rechargement.
  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" role="status">
        <Loader2 className="animate-spin text-imardos-blue" size={36} aria-hidden="true" />
        <span className="sr-only">Vérification de votre session…</span>
      </div>
    );
  }

  // Le serveur ne répond pas : la session est conservée, on propose de réessayer.
  if (status === 'unreachable') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <WifiOff className="mx-auto mb-4 text-imardos-orange" size={40} aria-hidden="true" />
          <h2 className="text-xl font-bold text-imardos-blue mb-2">Serveur injoignable</h2>
          <p className="text-gray-600 text-sm mb-6">
            Votre session est conservée. Vérifiez votre connexion internet, puis réessayez.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={retry}
              className="flex-1 bg-imardos-blue hover:bg-blue-800 text-white py-3 rounded-lg font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-imardos-orange"
            >
              Réessayer
            </button>
            <button
              onClick={logout}
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-imardos-orange"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return <AdminDashboard user={user} onLogout={logout} onUserUpdate={updateUser} />;
  }

  return <AdminLogin onLogin={login} />;
};

export default AdminGate;
