import { Link } from "react-router-dom";

const images = [
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400&h=300',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400&h=300',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400&h=300',
  'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400&h=300',
  'https://imardosong.22web.org/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-19-at-20.46.10.jpeg',
  'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=400&h=300'
];

const GallerySection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-imardos-blue mb-4">Galerie photos</h2>
          <div className="w-20 h-1 bg-imardos-orange mx-auto mb-6"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div key={index} className="overflow-hidden rounded-xl group relative h-64">
              <img 
                src={img} 
                alt={`Action IMARDOS ${index + 1}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-imardos-blue/0 group-hover:bg-imardos-blue/20 transition-colors duration-300"></div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link
            to="/galerie"
            className="inline-block border border-imardos-blue text-imardos-blue px-8 py-3 rounded-full font-medium hover:bg-imardos-blue hover:text-white transition-colors"
          >
            Voir plus de photos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;