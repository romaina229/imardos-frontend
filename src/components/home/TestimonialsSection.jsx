import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Quote } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Mme. Aïssa Traoré',
    role: 'Bénéficiaire - Santé Maternelle',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTleR9fSD2d46U_AJj6drXGBTULFrOGjTCF1ECdePG5uGaUykyPzM_c6vM&s=10',
    text: 'Grâce à IMARDOS, j\'ai pu accoucher dans de bonnes conditions. Leur accompagnement a été d\'une aide précieuse pour ma famille.'
  },
  {
    name: 'Jean-Baptiste K.',
    role: 'Enseignant - Partenaire Éducation',
    image: 'https://legrandfrere.africa/wp-content/uploads/d363f3c7-419b-4296-bf1c-5895e21801b2-768x432.png.webp',
    text: 'Le programme d\'alphabétisation d\'IMARDOS a transformé notre village. Aujourd\'hui, nos enfants ont accès à une éducation de qualité.'
  },
  {
    name: 'Fati Bouraïma',
    role: 'Leader Communautaire - Autonomisation',
    image: 'https://img.magnific.com/photos-gratuite/contenu-femme-affaires-ethnique-au-bureau-travail_1098-22009.jpg?semt=ais_hybrid&w=740&q=80',
    text: 'Les formations offertes par IMARDOS m\'ont permis de créer ma propre petite entreprise. Je suis désormais financièrement indépendante.'
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-imardos-light-blue">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-imardos-blue text-center mb-12">Témoignages</h2>
        
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="pb-12"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                <Quote className="text-imardos-orange w-10 h-10 mb-4 opacity-50" />
                <p className="text-gray-600 italic mb-6 leading-relaxed">"{item.text}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-imardos-orange"
                  />
                  <div>
                    <h4 className="font-bold text-imardos-blue">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialsSection;