import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const projects = [
  {
    id: 1,
    title: 'Projet Santé Maternelle',
    location: 'Département du Mono',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop',
    progress: 75,
    color: 'bg-imardos-blue',
    textColor: 'text-imardos-blue',
  },
  {
    id: 2,
    title: 'Éducation pour tous',
    location: 'Département du Zou',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2070&auto=format&fit=crop',
    progress: 60,
    color: 'bg-imardos-red',
    textColor: 'text-imardos-red',
  },
  {
    id: 3,
    title: 'Autonomisation des Femmes',
    location: 'Département de l\'Atlantique',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2070&auto=format&fit=crop',
    progress: 85,
    color: 'bg-imardos-green',
    textColor: 'text-imardos-green',
  },
];

const ProjectsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* En-tête de la section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-imardos-blue mb-3">Nos projets récents</h2>
            <p className="text-gray-600 max-w-lg">
              Découvrez nos actions concrètes menées sur le terrain pour améliorer la vie des communautés.
            </p>
          </div>
          <Link 
            to="/nos-actions" 
            className="mt-4 md:mt-0 text-imardos-blue font-medium border-b-2 border-imardos-orange hover:text-imardos-orange transition-colors pb-1"
          >
            Voir tous nos projets →
          </Link>
        </div>

        {/* Grille des 3 cartes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Image du projet */}
              <div className="h-56 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Contenu de la carte */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-imardos-blue mb-2">{project.title}</h3>
                
                {/* Localisation avec icône */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <MapPin size={16} className="text-imardos-orange" />
                  <span>{project.location}</span>
                </div>

                {/* Barre de progression */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className={project.textColor}>Progression</span>
                    <span className={project.textColor}>{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${project.color}`} 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Bouton Lire la suite (au survol ou toujours visible) */}
                <div className="mt-6">
                  <button className="w-full py-2 border border-imardos-blue text-imardos-blue rounded-full font-medium hover:bg-imardos-blue hover:text-white transition-colors duration-300">
                    En savoir plus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;