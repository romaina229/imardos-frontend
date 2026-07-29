import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Menu,
  Search,
  Calendar,
} from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-imardos-blue text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Colonne 1 : Logo & Description */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-imardos-orange">IM</span>ARDOS
            </div>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              IMARDOS agit pour le bien-être des communautés, en mettant l'accent sur la santé, l'éducation et le développement durable.
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/profile.php?id=100080912787464" className="bg-white/10 p-2 rounded-full hover:bg-imardos-orange transition-colors"><FaFacebook size={18} /></a>
              <a href="https://www.linkedin.com/company/imardos-ong" className="bg-white/10 p-2 rounded-full hover:bg-imardos-orange transition-colors"><FaLinkedin size={18} /></a>
              <a href="https://www.instagram.com/imardos_ong/" className="bg-white/10 p-2 rounded-full hover:bg-imardos-orange transition-colors"><FaInstagram size={18} /></a>
              <a href="https://youtu.be/6cXvOqmwiE4?si=X4OLT8LjoT3THjTo" className="bg-white/10 p-2 rounded-full hover:bg-imardos-orange transition-colors"><FaYoutube size={18} /></a>
            </div>
          </div>

          {/* Colonne 2 : Liens rapides */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Liens rapides</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-imardos-orange transition-colors">Accueil</Link></li>
              <li><Link to="/a-propos" className="hover:text-imardos-orange transition-colors">À propos de nous</Link></li>
              <li><Link to="/nos-actions" className="hover:text-imardos-orange transition-colors">Nos actions</Link></li>
              <li><Link to="/blog" className="hover:text-imardos-orange transition-colors">Actualités</Link></li>
              <li><Link to="/contact" className="hover:text-imardos-orange transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : IMARDOS ONG */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">IMARDOS ONG</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/offres-emploi" className="hover:text-imardos-orange transition-colors">Offres d'emploi</Link></li>
              <li><Link to="/evenements" className="hover:text-imardos-orange transition-colors">Évènements</Link></li>
              <li><Link to="/galerie" className="hover:text-imardos-orange transition-colors">Galerie photos</Link></li>
              <li><Link to="/results" className="hover:text-imardos-orange transition-colors">Résultats des offres</Link></li>
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Nous contacter</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-imardos-orange mt-1 shrink-0" />
                <span>Abomey-Calavi, Tankpè, Bénin</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-imardos-orange shrink-0" />
                <span>+229 01 40 15 24 43</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-imardos-orange shrink-0" />
                <span>imardos@gmail.com</span>
              </li>
              <li className="mt-4">
                <Link to="/don" className="bg-imardos-orange hover:bg-orange-600 text-white px-5 py-2 rounded-full font-bold inline-block transition-all shadow-md">
                  Faire un don
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} IMARDOS ONG. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;