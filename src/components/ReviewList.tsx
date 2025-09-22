import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../types';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-burgundy text-white rounded-full flex items-center justify-center font-semibold">
                {review.user_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-charcoal">{review.user_name}</p>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-gold text-gold' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(review.created_at)}
            </span>
          </div>
          
          <p className="text-gray-700 leading-relaxed">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;