import { Link } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/a-propos' },
    { name: 'Nos actions', path: '/nos-actions' },
    { name: 'Offres d\'emploi', path: '/offres-emploi' }, 
    { name: 'Évènements', path: '/evenements' },         
    { name: 'Galerie', path: '/galerie' },               
    { name: 'Blog', path: '/blog' },
    { name: 'Avis', path: '/avis' },                     
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-imardos-blue text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4">
          <img
            src="/logos/logo-imardoss.jpg"
            alt="IMARDOS ONG"
            className="h-14 w-auto"
          />
          <span className="text-2xl font-bold tracking-wide text-white">
            IMARDOS ONG
          </span>
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="hover:text-imardos-orange transition-colors text-sm font-medium">
              {link.name}
            </Link>
          ))}
          <Link 
            to="/don" 
            className="bg-imardos-orange hover:bg-orange-600 text-white px-5 py-2 rounded-full font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Heart size={16} /> Faire un don
          </Link>
        </div>

        {/* Menu Mobile (Bouton burger) */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu Mobile (Déroulant) */}
      {isOpen && (
        <div className="md:hidden bg-imardos-blue border-t border-white/20">
          <div className="flex flex-col px-4 py-4 gap-4">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="hover:text-imardos-orange transition-colors" onClick={() => setIsOpen(false)}>
                {link.name}
              </Link>
            ))}
            <Link 
              to="/don" 
              className="bg-imardos-orange hover:bg-orange-600 text-center text-white px-5 py-2 rounded-full font-bold"
              onClick={() => setIsOpen(false)}
            >
              Faire un don
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;