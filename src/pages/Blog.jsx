import { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/config';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/blogs').then(res => {
      setBlogs(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-imardos-blue mb-4">Blog</h1>
          <div className="w-24 h-1 bg-imardos-orange mx-auto mb-6"></div>
        </div>

        {loading ? (
          <div className="text-center py-12"><Loader2 className="animate-spin text-imardos-blue mx-auto mb-2" size={32} /><p className="text-gray-500">Chargement...</p></div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Aucun article publié pour le moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
                <div className="h-52 overflow-hidden relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-medium text-imardos-blue shadow-md">{post.category}</span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-imardos-blue mb-2 leading-tight">{post.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
                  <Link to={`/blog/${post.id}`} className="text-imardos-orange font-medium text-sm hover:underline flex items-center gap-1 mt-auto">Lire la suite <ArrowRight size={16} /></Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Blog;