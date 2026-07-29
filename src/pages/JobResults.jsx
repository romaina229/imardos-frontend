import { useState, useEffect } from 'react';
import { Loader2, FileText, Calendar, User } from 'lucide-react';
import { apiClient } from '../api/config';

const JobResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/job-results').then(res => {
      setResults(res.data);
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
          <h1 className="text-4xl md:text-5xl font-bold text-imardos-blue mb-4">Résultats des offres</h1>
          <div className="w-24 h-1 bg-imardos-orange mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">Consultez ici les résultats des études de dossiers pour nos recrutements.</p>
        </div>

        {loading ? (
          <div className="text-center py-12"><Loader2 className="animate-spin text-imardos-blue mx-auto mb-2" size={32} /><p className="text-gray-500">Chargement des résultats...</p></div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Aucun résultat de recrutement n'a encore été publié.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {results.filter(r => r.status === 'Publié').map((result) => (
              <div key={result.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-imardos-light-blue rounded-full flex items-center justify-center text-imardos-blue shrink-0">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-imardos-blue">{result.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <User size={14} /> {result.job_title}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      <Calendar size={14} /> {result.created_at ? new Date(result.created_at).toLocaleDateString('fr-FR') : 'Récent'}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-imardos-blue text-sm mb-2">Détails des résultats :</h4>
                  <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {result.result_content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default JobResults;