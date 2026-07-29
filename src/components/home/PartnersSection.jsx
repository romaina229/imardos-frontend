
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const partners = [
  {
    name: "UNICEF",
    logo: "/logos/unicef.webp",
  },
  {
    name: "UNFPA",
    logo: "/logos/unfpa.svg",
  },
  {
    name: "PNUD",
    logo: "/logos/undp.svg",
  },
  {
    name: "OSV Jordan",
    logo: "/logos/OSV.png",
  },
  {
    name: "e-Vie ONG",
    logo: "/logos/E-Vie.png",
  },
  {
    name: "BUPDOS ONG",
    logo: "/logos/bupdos.jpg",
  },
  {
    name: "MASM",
    logo: "/logos/logo-masm.png",
  },
  {
    name: "Droit d'elle",
    logo: "/logos/elle.png",
  },
  {
    name: "ABPF",
    logo: "/logos/logoabpf.jpg",
  },
];

const PartnersSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-imardos-blue">
            Nos partenaires
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            IMARDOS ONG collabore avec des partenaires nationaux et
            internationaux pour améliorer durablement les conditions de vie des
            populations.
          </p>
        </div>

         <Swiper
          modules={[Autoplay]}
          slidesPerView={2}
          spaceBetween={40}
          loop={true}
          speed={5000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 6,
            },
          }}
        >
          {partners.map((partner) => (
            <SwiperSlide key={partner.name}>
              <div className="flex justify-center items-center h-24">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-14 w-auto object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default PartnersSection;