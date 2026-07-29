import { Link } from "react-router-dom";

const images = [
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400&h=300',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400&h=300',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400&h=300',
  'https://scontent.fcoo4-1.fna.fbcdn.net/v/t39.30808-6/746909452_1070302749010141_1372475787662548497_n.jpg?stp=dst-jpg_tt6&cstp=mx1873x840&ctp=p180x540&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeE3h3vPpD_J_JsZ6l35AmVqtLRMo78l-ga0tEyjvyX6Bp0kf2BY0PkqkrYbjGDY-dX3Z3qRmv_wnbJ22GbYzkBh&_nc_ohc=pd68iX4Gfp8Q7kNvwH9mPze&_nc_oc=AdqpNkWC7jnPNfYp3ziL9p_wvTdZgDL9GLdW1GH-VVuyVEpKc7JQzskGfM_gN6wcjqM&_nc_zt=23&_nc_ht=scontent.fcoo4-1.fna&_nc_gid=UnOd8hsYOMYYyAeuqpiJFw&_nc_ss=7b2a8&oh=00_AQCSVX_KYMVlTNXIKFgS8NhjKczUcDxMPcy432vINfmgoQ&oe=6A6FDD38',
  'https://imardosong.22web.org/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-19-at-20.46.10.jpeg',
  'https://scontent.fcoo4-1.fna.fbcdn.net/v/t39.30808-6/741464562_1066310276076055_6919953079577792027_n.jpg?stp=dst-jpg_tt6&cstp=mx1040x870&ctp=s590x590&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeE2Dz73ybl7QHlYV2I0TY2TOOYvPosvI1E45i8-iy8jUWhudm-Y2mcibeyY8vNyvLGekK3sQb6deaVkykNvTpX3&_nc_ohc=xPn4u5YHLJQQ7kNvwFaMTtM&_nc_oc=AdrnbR2yexB0-SE9JyAiZm33VmgRWQTq-qFcze48KSa1FA_jfSwaFFs_D-RuYj8RiHU&_nc_zt=23&_nc_ht=scontent.fcoo4-1.fna&_nc_gid=UnOd8hsYOMYYyAeuqpiJFw&_nc_ss=7b2a8&oh=00_AQB7aLwXynRCn4DqPfZbZTL--0_cjNxm8yPXpBfkIePQsg&oe=6A700BC9'
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