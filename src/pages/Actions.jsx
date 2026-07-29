import { useState, useEffect } from 'react';
import { MapPin, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../api/config';

const Actions = () => {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const res = await apiClient.get('/actions');
        setActions(res.data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActions();
  }, []);

  const categories = ['Tous', ...new Set(actions.map(action => action.category))];
  const filteredActions = activeCategory === 'Tous' ? actions : actions.filter(action => action.category === activeCategory);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'En cours': return <Clock size={16} className="text-imardos-orange" />;
      case 'Terminé': return <CheckCircle size={16} className="text-imardos-green" />;
      case 'À venir': return <XCircle size={16} className="text-imardos-red" />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-imardos-blue mb-4">Nos actions</h1>
          <div className="w-24 h-1 bg-imardos-orange mx-auto mb-6"></div>
        </div>

        {loading ? (
          <div className="text-center py-20"><Loader2 className="animate-spin text-imardos-blue mx-auto mb-2" size={32} /><p className="text-gray-500">Chargement des actions...</p></div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${activeCategory === cat ? 'bg-imardos-blue text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>{cat}</button>
              ))}
            </div>

            {filteredActions.length === 0 ? (
              <div className="text-center py-16 text-gray-500"><p>Aucune action trouvée pour le moment.</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredActions.map((action) => (
                  <div key={action.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-gray-100">
                    <div className="relative h-56 overflow-hidden">
                      <img src={action.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800'} alt={action.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1.5 shadow-md ${action.status === 'En cours' ? 'bg-imardos-orange' : action.status === 'Terminé' ? 'bg-imardos-green' : 'bg-gray-500'}`}>{getStatusIcon(action.status)}{action.status}</div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2"><h3 className="text-xl font-bold text-imardos-blue leading-tight pr-4">{action.title}</h3><span className="text-xs font-medium bg-imardos-light-blue text-imardos-blue px-2 py-1 rounded">{action.category}</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4"><MapPin size={16} className="text-imardos-orange" /><span>{action.location}</span></div>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">{action.description}</p>
                      <button className="w-full py-2.5 border border-imardos-blue text-imardos-blue rounded-lg font-medium hover:bg-imardos-blue hover:text-white transition-colors duration-300 text-sm">Lire la suite</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Actions;