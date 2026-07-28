import { Briefcase, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { jobsData } from '../data/jobsData';

const Jobs = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-imardos-blue mb-4">Offres d'emploi</h1>
          <div className="w-24 h-1 bg-imardos-orange mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">Rejoignez notre équipe dynamique et inclusive. Consultez nos offres disponibles.</p>
        </div>

        <div className="space-y-6">
          {jobsData.map((job) => (
            <div key={job.id} className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-imardos-blue">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-imardos-blue">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Briefcase size={16} /> {job.type}</span>
                    <span className="flex items-center gap-1"><MapPin size={16} /> {job.department}</span>
                    <span className="flex items-center gap-1"><Calendar size={16} /> Date limite: {job.deadline}</span>
                  </div>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{job.description}</p>
                </div>
                <button className="shrink-0 bg-imardos-orange hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2">
                  Postuler <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Jobs;