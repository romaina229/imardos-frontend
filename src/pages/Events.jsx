import { Calendar, MapPin, Tag } from 'lucide-react';
import { eventsData } from '../data/eventsData';

const Events = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-imardos-blue mb-4">Évènements</h1>
          <div className="w-24 h-1 bg-imardos-orange mx-auto mb-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {eventsData.map((event) => (
            <div key={event.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col h-full border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <span className="bg-imardos-light-blue text-imardos-blue text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag size={14} /> {event.type}
                </span>
              </div>
              <h3 className="text-xl font-bold text-imardos-blue mb-2">{event.title}</h3>
              <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="flex items-center gap-2"><MapPin size={16} /> {event.location}</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">{event.description}</p>
              <button className="mt-4 w-full py-2 border border-imardos-blue text-imardos-blue rounded-lg hover:bg-imardos-blue hover:text-white transition-colors text-sm font-medium">
                Voir les détails
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Events;