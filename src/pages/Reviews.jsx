import { Star, ThumbsUp, User } from 'lucide-react';
import { reviewsData } from '../data/reviewsData';

const Reviews = () => {
  const totalReviews = reviewsData.length;
  const averageRating = (reviewsData.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1);

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-imardos-blue mb-4">Résultats des avis</h1>
          <div className="w-24 h-1 bg-imardos-orange mx-auto mb-6"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 text-center max-w-2xl mx-auto border border-gray-100">
          <div className="text-5xl font-bold text-imardos-orange mb-2">{averageRating}</div>
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={24} className={i < Math.round(parseFloat(averageRating)) ? "fill-imardos-orange text-imardos-orange" : "text-gray-300"} />
            ))}
          </div>
          <p className="text-gray-500 text-sm">Basé sur <strong>{totalReviews}</strong> avis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewsData.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-start gap-4 mb-3">
                {review.avatar ? (
                  <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-imardos-light-blue" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-imardos-light-blue flex items-center justify-center text-imardos-blue"><User size={24} /></div>
                )}
                <div>
                  <h4 className="font-bold text-imardos-blue">{review.name}</h4>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? "fill-imardos-orange text-imardos-orange" : "text-gray-300"} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm italic leading-relaxed">"{review.comment}"</p>
              <div className="mt-3 flex justify-end">
                <span className="flex items-center gap-1 text-xs text-gray-400"><ThumbsUp size={14} /> Utile</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Reviews;