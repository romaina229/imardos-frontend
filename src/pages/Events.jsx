import { useState, useEffect } from 'react';
import { Calendar, MapPin, Tag, Loader2 } from 'lucide-react';
import { apiClient } from '../api/config';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/events').then(res => {
      setEvents(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-imardos-blue mb-4">Évènements</h1>
          <div className="w-24 h-1 bg-imardos-orange mx-auto mb-6"></div>
        </div>

        {loading ? (
          <div className="text-center py-12"><Loader2 className="animate-spin text-imardos-blue mx-auto mb-2" size={32} /><p className="text-gray-500">Chargement...</p></div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Aucun évènement prévu pour le moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col h-full border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <span className="bg-imardos-light-blue text-imardos-blue text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><Tag size={14} /> {event.type}</span>
                </div>
                <h3 className="text-xl font-bold text-imardos-blue mb-2">{event.title}</h3>
                <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="flex items-center gap-2"><MapPin size={16} /> {event.location}</span>
                </div>
                <button className="mt-4 w-full py-2 border border-imardos-blue text-imardos-blue rounded-lg hover:bg-imardos-blue hover:text-white transition-colors text-sm font-medium">Voir les détails</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Events;