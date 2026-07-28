import { galleryData } from '../data/galleryData';

const Gallery = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-imardos-blue mb-4">Galerie photos</h1>
          <div className="w-24 h-1 bg-imardos-orange mx-auto mb-6"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryData.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg h-64 bg-gray-200">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-white font-medium text-sm">{item.title}</p>
                <p className="text-gray-300 text-xs">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Gallery;