import { Stethoscope, GraduationCap, HandHeart, ShieldCheck, Heart, Users } from 'lucide-react';

const domains = [
  { 
    icon: Stethoscope, 
    title: 'Santé', 
    sub: 'Soins médicaux, prévention et nutrition.'
  },
  { 
    icon: GraduationCap, 
    title: 'Éducation', 
    sub: 'Scolarisation des enfants, alphabétisation.'
  },
  { 
    icon: HandHeart, 
    title: 'Autonomisation', 
    sub: 'Insertion socio-économique des femmes.'
  },
  { 
    icon: ShieldCheck, 
    title: 'Protection', 
    sub: 'Protection des droits des enfants et des plus vulnérables.'
  },
  { 
    icon: Heart, 
    title: 'DSSR', 
    sub: 'Santé sexuelle et reproductive des jeunes et des femmes.'
  },
  { 
    icon: Users, 
    title: 'Développement', 
    sub: 'Renforcement des capacités et développement communautaire.'
  },
];

const DomainsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-imardos-blue mb-4">Nos domaines d'intervention</h2>
          {/* Ligne décorative orange */}
          <div className="w-20 h-1 bg-imardos-orange mx-auto mb-6"></div>
        </div>

        {/* GRID EXACTE DE LA MAQUETTE : 3 colonnes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {domains.map((domain, index) => (
            <div 
              key={index} 
              className="group bg-imardos-light-blue p-8 rounded-2xl transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center border-b-4 border-transparent hover:border-imardos-orange"
            >
              {/* Cercle avec icône (Comme sur la maquette) */}
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-imardos-blue shadow-md mb-4 group-hover:scale-110 transition-transform duration-300">
                <domain.icon size={28} />
              </div>
              
              {/* Titre */}
              <h3 className="text-lg font-bold text-imardos-blue mb-2">{domain.title}</h3>
              
              {/* Sous-titre */}
              <p className="text-gray-500 text-sm leading-relaxed">{domain.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DomainsSection;