import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { blogData } from '../data/blogData';

const BlogPost = () => {
  const { id } = useParams();
  const post = blogData.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-imardos-blue mb-4">Article non trouvé</h1>
          <Link to="/blog" className="text-imardos-orange hover:underline">Retour au blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Bouton retour */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-imardos-blue mb-6 transition-colors">
          <ArrowLeft size={18} /> Retour au blog
        </Link>

        {/* Article */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image en haut */}
          <img src={post.image} alt={post.title} className="w-full h-72 md:h-96 object-cover" />
          
          <div className="p-8 md:p-12">
            {/* Métadonnées */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1 bg-imardos-light-blue px-3 py-1 rounded-full text-imardos-blue font-medium">
                <Tag size={14} /> {post.category}
              </span>
              <span className="flex items-center gap-1"><User size={16} /> {post.author}</span>
              <span className="flex items-center gap-1"><Calendar size={16} /> {post.date}</span>
            </div>

            {/* Titre */}
            <h1 className="text-3xl md:text-4xl font-bold text-imardos-blue mb-6">{post.title}</h1>

            {/* Contenu (Rendu HTML sécurisé) */}
            <div 
              className="prose prose-blue max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;