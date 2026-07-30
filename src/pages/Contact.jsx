import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram,  FaLinkedin,  FaYoutube, FaWhatsapp,} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { apiClient } from '../api/config';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiClient.post('/contacts', data);
      
      setIsSubmitted(true);
      reset(); // On réinitialise le formulaire
      setTimeout(() => {
        setIsSubmitted(false);
        setIsSubmitting(false);
      }, 5000);
      
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      alert("Une erreur est survenue. Veuillez réessayer plus tard.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4">
        
        {/* En-tête de la page */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-imardos-blue mb-4">Contact</h1>
          <div className="w-24 h-1 bg-imardos-orange mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Vous avez une question, une suggestion ou souhaitez collaborer avec IMARDOS ? N'hésitez pas à nous contacter via le formulaire ci-dessous.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            
            {/* --- COLONNE DE GAUCHE (Informations) - 2/5 de large --- */}
            <div className="lg:col-span-2 bg-imardos-blue text-white p-8 md:p-12 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-6">Informations</h2>
                <p className="text-imardos-light-blue mb-8 text-sm">
                  Nous sommes disponibles pour répondre à toutes vos questions. Rejoignez-nous dans notre mission.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-imardos-orange shrink-0 mt-1" size={22} />
                    <div>
                      <p className="font-medium">Adresse</p>
                      <p className="text-sm text-imardos-light-blue">Abomey-Calavi, Tankpè,<br/>Maison AGBODJEGLODJO Michel,<br/>BP : 1071 Abomey-Calavi, Bénin</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Phone className="text-imardos-orange shrink-0" size={22} />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-sm text-imardos-light-blue">+229 01 40 15 24 43</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Mail className="text-imardos-orange shrink-0" size={22} />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-imardos-light-blue">imardos@gmail.com</p>
                    </div>
                  </div>
                </div>

                {/* Réseaux Sociaux */}
                <div className="mt-10">
                  <p className="font-medium mb-3">Suivez-nous</p>
                  <div className="flex gap-3">
                    <a href="https://www.facebook.com/profile.php?id=100080912787464" className="bg-white/10 p-2 rounded-full hover:bg-imardos-orange transition-colors"><FaFacebook size={18} /></a>
                    <a href="https://www.linkedin.com/company/imardos-ong" className="bg-white/10 p-2 rounded-full hover:bg-imardos-orange transition-colors"><FaLinkedin size={18} /></a>
                    <a href="https://www.instagram.com/imardos_ong/" className="bg-white/10 p-2 rounded-full hover:bg-imardos-orange transition-colors"><FaInstagram size={18} /></a>
                    <a href="https://youtu.be/6cXvOqmwiE4?si=X4OLT8LjoT3THjTo" className="bg-white/10 p-2 rounded-full hover:bg-imardos-orange transition-colors"><FaYoutube size={18} /></a>
                  </div>
                </div>
              </div>

              {/* Cercle décoratif en arrière-plan */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full"></div>
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/5 rounded-full"></div>
            </div>

            {/* --- COLONNE DE DROITE (Formulaire + Carte) - 3/5 de large --- */}
            <div className="lg:col-span-3 p-8 md:p-12 bg-white">
              <h2 className="text-2xl font-bold text-imardos-blue mb-6">Envoyez-nous un message</h2>
              
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
                  Merci ! Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                </div>
              ) : null}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                    <input 
                      type="text" 
                      {...register('name', { required: 'Le nom est requis' })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-imardos-orange focus:border-imardos-orange outline-none transition ${errors.name ? 'border-red-500' : 'border-gray-300'}`} 
                      placeholder="Votre nom"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input 
                      type="email" 
                      {...register('email', { required: 'L\'email est requis', pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' } })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-imardos-orange focus:border-imardos-orange outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-300'}`} 
                      placeholder="votre.email@exemple.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                  <input 
                    type="text" 
                    {...register('subject')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange focus:border-imardos-orange outline-none transition" 
                    placeholder="Sujet du message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea 
                    {...register('message', { required: 'Le message est requis' })}
                    rows="4" 
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-imardos-orange focus:border-imardos-orange outline-none transition resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'}`} 
                    placeholder="Écrivez votre message ici..."
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary w-full md:w-auto px-8 py-3 flex items-center justify-center gap-2"
                >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>

              {/* Carte Google Maps interactive */}
              <div className="mt-10">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Retrouvez-nous sur la carte
                </p>

                <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-sm border border-gray-200">
                  <iframe
                    title="Localisation IMARDOS - Tankpè, Abomey-Calavi"
                    src="https://www.google.com/maps?q=Tankpè%2C%20Abomey-Calavi%2C%20Bénin&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  IMARDOS — Tankpè, Abomey-Calavi, Bénin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;