import { ArrowRight, Award, Users, MapPin, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative w-full h-[90vh] min-h-[650px] flex flex-col justify-center overflow-hidden">
      
      {/* Image de fond avec overlay bleu */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" 
          alt="Enfants souriants IMARDOS" 
          className="w-full h-full object-cover"
        />
        {/* Overlay dégradé bleu foncé pour garantir la lisibilité du texte */}
        <div className="absolute inset-0 bg-imardos-blue/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-imardos-blue via-transparent to-transparent opacity-90"></div>
      </div>

      {/* Contenu textuel principal */}
      <div className="relative z-10 container mx-auto px-4 flex-grow flex items-center">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            Construisons ensemble <br /> un avenir meilleur
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-gray-200 text-lg md:text-xl max-w-xl mb-8 font-light leading-relaxed"
          >
            IMARDOS agit pour le bien-être des communautés, en mettant l'accent sur la santé, l'éducation et le développement durable.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link 
              to="/nos-actions" 
              className="btn-primary inline-flex"
            >
              Découvrir nos actions <ArrowRight size={20} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Barre de statistiques flottante (Bas du Hero) */}
      <div className="relative z-10 container mx-auto px-4 transform translate-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="bg-white rounded-xl shadow-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 border border-gray-100"
        >
          <div className="flex flex-col items-center text-center border-r border-gray-100 last:border-0 md:last:border-0">
            <Award className="text-imardos-red w-8 h-8 mb-2" />
            <span className="text-2xl font-bold text-gray-800">6+</span>
            <span className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">Ans d'expérience</span>
          </div>
          <div className="flex flex-col items-center text-center border-r border-gray-100 last:border-0 md:last:border-0">
            <Users className="text-imardos-red w-8 h-8 mb-2" />
            <span className="text-2xl font-bold text-gray-800">2 500+</span>
            <span className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">Bénéficiaires</span>
          </div>
          <div className="flex flex-col items-center text-center border-r border-gray-100 last:border-0 md:last:border-0">
            <MapPin className="text-imardos-red w-8 h-8 mb-2" />
            <span className="text-2xl font-bold text-gray-800">25+</span>
            <span className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">Localités</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <HeartHandshake className="text-imardos-red w-8 h-8 mb-2" />
            <span className="text-2xl font-bold text-gray-800">10+</span>
            <span className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">Projets réalisés</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;