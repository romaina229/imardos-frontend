import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Loader2 } from 'lucide-react';
import { apiClient } from '../api/config';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/blogs/${id}`).then(res => {
      setPost(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-imardos-blue" size={32} /></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center text-gray-500">Article non trouvé</div>;

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-imardos-blue mb-6 transition-colors"><ArrowLeft size={18} /> Retour au blog</Link>
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-72 md:h-96 object-cover" />
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1 bg-imardos-light-blue px-3 py-1 rounded-full text-imardos-blue font-medium"><Tag size={14} /> {post.category}</span>
              <span className="flex items-center gap-1"><User size={16} /> {post.author}</span>
              <span className="flex items-center gap-1"><Calendar size={16} /> {post.date}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-imardos-blue mb-6">{post.title}</h1>
            <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </article>
      </div>
    </div>
  );
};
export default BlogPost;