import { Shield, Users, Heart, Target, MapPin, BookOpen, Leaf, Lightbulb, Handshake, Scale, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white">
      
      {/* --- SECTION 1: HERO DE LA PAGE (Comme sur la maquette) --- */}
      <section className="relative text-white py-25 md:py-28 overflow-hidden">
        {/* Image en arrière-plan, sur toute la section */}
        <div className="absolute inset-0">
          <img 
            src="https://media.istockphoto.com/id/1319013519/fr/photo/verticale-de-femme-africaine-adolescente-regardant-lappareil-photo-portant-un-paquet-de-bois.jpg?s=612x612&w=0&k=20&c=1WN_Iv-cazSUFUPp42hJaKkKNxrmdVI7mSsg2kFGe_M=" 
            alt="Équipe IMARDOS" 
            className="w-full h-full object-cover"
          />
          {/* Voile bleu pour garder le texte lisible et rester dans la charte IMARDOS */}
          <div className="absolute inset-0 bg-imardos-blue/30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">À propos de nous</h1>
          <p className="text-imardos-light-blue text-lg max-w-2xl">
            Découvrez qui nous sommes, notre mission, nos valeurs et notre engagement pour le développement communautaire.
          </p>
        </div>
      </section>

      {/* --- SECTION 2: HISTORIQUE & MISSION (Texte + 3 cartes) --- */}
      <section className="py-20 bg-imardos-light-blue">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-imardos-blue mb-6">Notre Histoire</h2>
              <div className="w-16 h-1 bg-imardos-orange mb-6"></div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Initiative Motivée par Amour pour la Recherche, le Développement et les Œuvres Sociales (<strong>IMARDOS-ONG</strong>) est une association apolitique, non confessionnelle et à but non lucratif, créée en 2021 et enregistrée le 09 septembre 2022 par un groupe de jeunes bénévoles (filles et garçons).
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Elle est enregistrée officiellement par l’État béninois sous le récépissé <strong>N°241/MISP/DC/SGM/DAIC/SAAP-ASSOC/SA</strong>, conformément aux textes en vigueur sur la liberté d’association au Bénin. Son siège social est situé dans le Département de l’Atlantique, Commune d’Abomey-Calavi, C/B, maison AGBODJEGLODJO Michel, BP : 1071 Abomey-Calavi.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Membre du Réseau des OSC pour la promotion de l’Education à la Santé Sexuelle (<strong>ROPESS Bénin</strong>), IMARDOS ONG se positionne comme une organisation de proximité qui agit au cœur des communautés, en synergie avec les autorités locales, les services publics de santé et d’éducation, ainsi que d’autres OSC partenaires.
              </p>
            </div>
            
            {/* Cartes Objectif & Mission */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-imardos-orange">
                <h3 className="text-xl font-bold text-imardos-blue flex items-center gap-2 mb-2">
                  <Target className="text-imardos-orange" size={22} /> Notre Objectif
                </h3>
                <p className="text-gray-600">Contribuer au mieux-être des populations vulnérables, en particulier les jeunes, les filles et les femmes en matière des droits et santé sexuelles et reproductive.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-imardos-green">
                <h3 className="text-xl font-bold text-imardos-blue flex items-center gap-2 mb-2">
                  <Heart className="text-imardos-green" size={22} /> Notre Mission
                </h3>
                <p className="text-gray-600">Promouvoir les droits humains et l’épanouissement socio-économique des populations vulnérables, surtout les jeunes, les filles et les femmes, à travers l’accès aux droits, aux services de santé sexuels et reproductive et d’éducation de qualité équitable.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: DOMAINES D'INTERVENTION & CIBLES --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Colonne 1 & 2 : Domaines d'intervention */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-imardos-blue mb-6">Nos domaines d'intervention</h2>
              <div className="w-16 h-1 bg-imardos-orange mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'DSSR des Adolescent.e.s et jeunes (en particulier les filles)',
                  'Lutte contre les violences basées sur le genre (VBG)',
                  'Paix et cohésion sociales',
                  'Genre / Égalité des Genres / Approches transformatrices',
                  'Planification familiale',
                  'Autonomisation socio-économique des jeunes et des femmes',
                  'Avortement sécurisé',
                  'Accès équitable à l\'éducation et aux TIC',
                  'Protection de l\'environnement et développement durable',
                  'Engagement des leaders communautaires et religieux'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-imardos-light-blue transition-colors">
                    <div className="bg-imardos-orange/20 p-1 rounded-full mt-1"><Leaf size={16} className="text-imardos-orange" /></div>
                    <p className="text-gray-700 text-sm font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Colonne 3 : Nos cibles */}
            <div className="bg-imardos-blue text-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Nos cibles</h2>
              <p className="text-imardos-light-blue mb-6 text-sm">IMARDOS œuvre pour et avec :</p>
              <ul className="space-y-3">
                {['Filles', 'Femmes', 'Jeunes', 'Enfants', 'Minorités', 'Personnes en situation de handicap'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
                    <Users size={18} className="text-imardos-orange" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: COMPOSITION DE L'ÉQUIPE --- */}
      <section className="py-20 bg-imardos-light-blue">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-imardos-blue mb-4">Composition de notre équipe</h2>
            <div className="w-20 h-1 bg-imardos-orange mx-auto mb-6"></div>
            <p className="text-gray-600">IMARDOS ONG dispose d’une équipe jeune, dynamique et inclusive, composée majoritairement de jeunes et de femmes, reflétant son identité et sa mission.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-imardos-blue/10 rounded-full flex items-center justify-center text-imardos-blue mb-4 mx-auto">
                <Scale size={28} />
              </div>
              <h4 className="font-bold text-center text-imardos-blue mb-2">Conseil d’administration</h4>
              <p className="text-sm text-gray-600 text-center">Assure l’orientation stratégique et veille à la bonne gouvernance. Présidé par un jeune leader engagé dans la promotion des DSSR des Adolescent.e.s et jeunes.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-imardos-blue/10 rounded-full flex items-center justify-center text-imardos-blue mb-4 mx-auto">
                <Users size={28} />
              </div>
              <h4 className="font-bold text-center text-imardos-blue mb-2">Direction exécutive</h4>
              <p className="text-sm text-gray-600 text-center">Coordonnée par un Directeur exécutif, secondé par une coordonnatrice et un comité restreint composé de jeunes garçons et filles.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-imardos-blue/10 rounded-full flex items-center justify-center text-imardos-blue mb-4 mx-auto">
                <Zap size={28} />
              </div>
              <h4 className="font-bold text-center text-imardos-blue mb-2">Équipe opérationnelle</h4>
              <p className="text-sm text-gray-600 text-center">Constituée de chargés de projets par département, d’animateurs volontaires par commune, de bénévoles (jeunes et femmes leaders).</p>
            </div>
          </div>

          {/* Statistiques clés de l'équipe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-6 border border-gray-100">
              <span className="text-4xl font-bold text-imardos-orange">65%</span>
              <div>
                <p className="font-bold text-imardos-blue">Jeunes de moins de 35 ans</p>
                <p className="text-sm text-gray-500">dans l'équipe permanente</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-6 border border-gray-100">
              <span className="text-4xl font-bold text-imardos-green">55%</span>
              <div>
                <p className="font-bold text-imardos-blue">Femmes et Jeunes</p>
                <p className="text-sm text-gray-500">aux postes de coordination de programmes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 5: APPROCHES & STRATÉGIES --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Approches */}
            <div>
              <h2 className="text-3xl font-bold text-imardos-blue mb-4">Nos Approches</h2>
              <div className="w-16 h-1 bg-imardos-orange mb-6"></div>
              <p className="text-gray-600 mb-6 text-sm">Les activités d'IMARDOS se reposent sur des approches innovantes :</p>
              <div className="grid grid-cols-2 gap-4">
                {['Participative', 'Genre transformationnel', 'Inclusion sociale', 'Redevabilité citoyenne'].map((item, idx) => (
                  <div key={idx} className="bg-imardos-light-blue p-4 rounded-lg text-center hover:bg-imardos-blue hover:text-white transition-colors group cursor-default">
                    <p className="font-medium">{item}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-gray-600 italic">IMARDOS adopte une approche sensible au genre et inclusive, pour garantir la participation des jeunes, filles et femmes y compris les jeunes en situation de handicap, dès l’identification des besoins jusqu’à l’évaluation des résultats.</p>
            </div>

            {/* Stratégies */}
            <div>
              <h2 className="text-3xl font-bold text-imardos-blue mb-4">Nos stratégies d'intervention</h2>
              <div className="w-16 h-1 bg-imardos-orange mb-6"></div>
              <div className="space-y-4">
                {[
                  { icon: <BookOpen size={20} />, title: 'Sensibilisation et référencement' },
                  { icon: <Lightbulb size={20} />, title: 'Renforcement de capacités' },
                  { icon: <Handshake size={20} />, title: 'Plaidoyer' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-imardos-orange">
                    <div className="text-imardos-blue">{item.icon}</div>
                    <p className="font-medium text-imardos-blue">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 6: ZONES D'INTERVENTION & ANCRAGE --- */}
      <section className="py-20 bg-imardos-light-blue">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Zones d'intervention */}
            <div>
              <h2 className="text-3xl font-bold text-imardos-blue mb-4">Nos zones d'intervention</h2>
              <div className="w-16 h-1 bg-imardos-orange mb-6"></div>
              <div className="grid grid-cols-2 gap-3">
                {['Alibori', 'Atacora', 'Atlantique', 'Borgou', 'Collines', 'Couffo', 'Mono', 'Littoral', 'Plateau', 'Ouémé', 'Zou'].map((dept, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded shadow-sm border border-gray-100">
                    <MapPin size={14} className="text-imardos-orange" />
                    <span className="text-sm font-medium text-gray-700">{dept}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ancrage communautaire */}
            <div>
              <h2 className="text-3xl font-bold text-imardos-blue mb-4">Notre ancrage communautaire</h2>
              <div className="w-16 h-1 bg-imardos-orange mb-6"></div>
              <p className="text-gray-600 mb-4 text-sm">Nous travaillons en étroite collaboration avec :</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-imardos-orange rounded-full"></div> Les élus locaux</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-imardos-orange rounded-full"></div> Les autorités sanitaires</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-imardos-orange rounded-full"></div> Les leaders communautaires et religieux</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-imardos-orange rounded-full"></div> Les chefs de village et d’arrondissement</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-imardos-orange rounded-full"></div> Les centres de santé et écoles locales</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-imardos-orange rounded-full"></div> Les associations de jeunes, de femmes et ONG partenaires</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default About;