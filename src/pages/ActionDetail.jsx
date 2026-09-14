import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../api/config';

const ActionDetail = () => {
  const { id } = useParams();
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    apiClient.get(`/actions/${id}`).then(res => {
      setAction(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setError(true);
      setLoading(false);
    });
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'En cours': return <Clock size={16} className="text-imardos-orange" />;
      case 'Terminé': return <CheckCircle size={16} className="text-imardos-green" />;
      case 'À venir': return <XCircle size={16} className="text-imardos-red" />;
      default: return <Clock size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-imardos-blue" size={32} />
      </div>
    );
  }

  if (error || !action) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 gap-4">
        <p>Action introuvable ou supprimée.</p>
        <Link to="/nos-actions" className="text-imardos-blue font-medium hover:underline flex items-center gap-2">
          <ArrowLeft size={18} /> Retour à nos actions
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/nos-actions" className="inline-flex items-center gap-2 text-gray-500 hover:text-imardos-blue mb-6 transition-colors">
          <ArrowLeft size={18} /> Retour à nos actions
        </Link>

        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-72 md:h-96">
            <img
              src={action.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800'}
              alt={action.title}
              className="w-full h-full object-cover bg-gray-100"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800'; }}
            />
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1.5 shadow-md ${action.status === 'En cours' ? 'bg-imardos-orange' : action.status === 'Terminé' ? 'bg-imardos-green' : 'bg-gray-500'}`}>
              {getStatusIcon(action.status)}{action.status}
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-imardos-blue">{action.title}</h1>
              <span className="text-xs font-medium bg-imardos-light-blue text-imardos-blue px-3 py-1.5 rounded-full whitespace-nowrap">{action.category}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <MapPin size={16} className="text-imardos-orange" />
              <span>{action.location}</span>
            </div>

            <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
              {action.description}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ActionDetail;
