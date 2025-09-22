import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface ReviewFormProps {
  productId: string;
  user: User;
  onSubmit: () => void;
  onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, user, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating,
          comment: comment.trim(),
          user_name: user.email?.split('@')[0] || 'Anonymous'
        });

      if (error) throw error;
      onSubmit();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl mb-8 shadow-soft">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Write Your Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your thoughts about this fragrance..."
            className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-moonlight-400 resize-none"
            required
          />
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="submit"
            disabled={submitting || !comment.trim()}
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 text-white px-6 py-2 rounded-full font-semibold shadow-soft hover:shadow-glow dark:hover:shadow-dark-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;