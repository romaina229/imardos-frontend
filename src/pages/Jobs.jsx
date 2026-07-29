import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { apiClient } from '../api/config';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/jobse').then(res => {
      setJobs(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  // Simuler la soumission de candidature (Plus tard, vous enverrez un email via Laravel)
  const handleApply = (jobTitle) => {
    alert(`Candidature envoyée pour le poste : ${jobTitle} !`);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-imardos-blue mb-4">Offres d'emploi</h1>
          <div className="w-24 h-1 bg-imardos-orange mx-auto mb-6"></div>
        </div>

        {loading ? (
          <div className="text-center py-12"><Loader2 className="animate-spin text-imardos-blue mx-auto mb-2" size={32} /><p className="text-gray-500">Chargement...</p></div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Aucune offre d'emploi disponible.</div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => {
              const isExpired = new Date(job.deadline) < new Date(); // Vérifie si la date limite est dépassée

              return (
                <div key={job.id} className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-imardos-blue">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-imardos-blue">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Briefcase size={16} /> {job.type}</span>
                        <span className="flex items-center gap-1"><MapPin size={16} /> {job.department}</span>
                        <span className="flex items-center gap-1"><Calendar size={16} /> Date limite: {job.deadline}</span>
                      </div>
                      {isExpired && (
                        <span className="inline-flex items-center gap-1 text-red-500 text-xs font-bold mt-2 bg-red-50 px-2 py-1 rounded-full">
                          <XCircle size={14} /> EXPIRÉE
                        </span>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handleApply(job.title)}
                      disabled={isExpired}
                      className={`shrink-0 px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${isExpired ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-imardos-orange hover:bg-orange-600 text-white'}`}
                    >
                      {isExpired ? 'Clôturée' : 'Postuler'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default Jobs;