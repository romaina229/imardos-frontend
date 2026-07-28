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
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
    text: 'Grâce à IMARDOS, j\'ai pu accoucher dans de bonnes conditions. Leur accompagnement a été d\'une aide précieuse pour ma famille.'
  },
  {
    name: 'Jean-Baptiste K.',
    role: 'Enseignant - Partenaire Éducation',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    text: 'Le programme d\'alphabétisation d\'IMARDOS a transformé notre village. Aujourd\'hui, nos enfants ont accès à une éducation de qualité.'
  },
  {
    name: 'Fati Bouraïma',
    role: 'Leader Communautaire - Autonomisation',
    image: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?auto=format&fit=crop&q=80&w=200&h=200',
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