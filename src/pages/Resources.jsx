import { useState, useEffect } from 'react';
import { Loader2, FileText, Download, Calendar, Tag } from 'lucide-react';
import { apiClient } from '../api/config';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/resources').then(res => {
      setResources(res.data);
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
          <h1 className="text-4xl md:text-5xl font-bold text-imardos-blue mb-4">Ressources et documents</h1>
          <div className="w-24 h-1 bg-imardos-orange mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Retrouvez ici tous nos rapports d'activité, bilans annuels, brochures et documents officiels.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12"><Loader2 className="animate-spin text-imardos-blue mx-auto mb-2" size={32} /><p className="text-gray-500">Chargement des documents...</p></div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Aucune ressource n'a encore été publiée.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <span className="flex items-center gap-2 bg-imardos-light-blue text-imardos-blue px-3 py-1 rounded-full text-xs font-medium">
                    <Tag size={14} /> {resource.category}
                  </span>
                  {resource.file_size && (
                    <span className="text-xs text-gray-400 font-medium">{resource.file_size}</span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-imardos-blue mb-2">{resource.title}</h3>
                
                {resource.description && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">{resource.description}</p>
                )}
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={14} /> {new Date(resource.created_at).toLocaleDateString('fr-FR')}
                  </span>
                  
                  <a 
                    href={resource.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-imardos-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  >
                    <Download size={16} /> Télécharger
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;