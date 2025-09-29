import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingCart, Heart } from 'lucide-react';
import { Product, Review } from '../types';
import { supabase } from '../lib/supabase';
import ReviewList from './ReviewList';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [product.id]);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', product.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : product.rating;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-burgundy hover:text-burgundy-dark mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Products</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover rounded-2xl"
            />
            <button className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
              <Heart className="w-6 h-6 text-gray-400 hover:text-burgundy" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-lg text-burgundy font-medium uppercase tracking-wide">
              {product.brand}
            </span>
            <h1 className="text-4xl font-bold text-charcoal mt-2 mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? 'fill-gold text-gold'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-lg text-gray-600 ml-2">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <h3 className="font-semibold text-charcoal mb-2">Category</h3>
                <span className="inline-block bg-cream px-3 py-1 rounded-full text-sm text-charcoal">
                  {product.category}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-charcoal mb-2">Notes</h3>
                <div className="flex flex-wrap gap-2">
                  {product.notes.map((note, index) => (
                    <span
                      key={index}
                      className="bg-burgundy text-white px-3 py-1 rounded-full text-sm"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-charcoal mb-2">Volume</h3>
                <span className="text-gray-600">{product.volume}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-3xl font-bold text-charcoal">
                  ${product.price}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-charcoal">
                  Quantity:
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-burgundy"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-burgundy text-white py-4 rounded-2xl font-semibold hover:bg-burgundy-dark transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t border-gray-200 pt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-charcoal">Customer Reviews</h2>
        </div>

        {!loading && <ReviewList reviews={reviews} />}
      </div>
    </div>
  );
};

export default ProductDetail;