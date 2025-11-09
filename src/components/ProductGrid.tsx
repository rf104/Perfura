import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  searchQuery?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductSelect, onAddToCart, searchQuery = '' }) => {
  // Sample products if none exist
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Vampire Blood',
      brand: 'Euro Vally',
      price: 799,
      description: 'An intoxicating blend of Bulgarian rose and velvet musk',
      image_url: '/images/34.jpg',
      category: 'Floral',
      volume: '30ml',
      notes: ['Rose', 'Musk', 'Vanilla'],
      rating: 4.8,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Cool Water',
      brand: 'Perfura Special',
      price: 750,
      description: 'Deep, mysterious oud with hints of amber and sandalwood',
      image_url: '/images/11.jpeg',
      category: 'Oriental',
      volume: '30ml',
      notes: ['Oud', 'Amber', 'Sandalwood'],
      rating: 4.9,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Dior Sauvage',
      brand: 'Perfura Special',
      price: 810,
      description: 'Refreshing blend of bergamot, lemon, and white tea',
      image_url: '/images/34.jpg',
      category: 'Citrus',
      volume: '30ml',
      notes: ['Bergamot', 'Lemon', 'White Tea'],
      rating: 4.6,
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Wild Stone',
      brand: 'Botanica',
      price: 750,
      description: 'Exotic jasmine with woody undertones and soft vanilla',
      image_url: '/images/11.jpeg',
      category: 'Floral',
      volume: '30ml',
      notes: ['Jasmine', 'Sandalwood', 'Vanilla'],
      rating: 4.7,
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      name: 'One Man Show',
      brand: 'Perfura Special',
      price: 799,
      description: 'Fresh marine scent with sea salt and driftwood',
      image_url: '/images/34.jpg',
      category: 'Aquatic',
      volume: '30ml',
      notes: ['Sea Salt', 'Driftwood', 'Ambergris'],
      rating: 4.5,
      created_at: new Date().toISOString()
    },
    {
      id: '6',
      name: 'Golden Amber',
      brand: 'Imperial',
      price: 200,
      description: 'Luxurious amber with gold leaf and precious woods',
      image_url: '/images/11.jpeg',
      category: 'Oriental',
      volume: '50ml',
      notes: ['Amber', 'Gold Leaf', 'Cedar'],
      rating: 4.9,
      created_at: new Date().toISOString()
    }
  ];

  const allProducts = products.length > 0 ? products : sampleProducts;
  
  // Filter products based on search query
  const displayProducts = searchQuery.trim() === '' 
    ? allProducts 
    : allProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.notes.some(note => note.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
          {searchQuery.trim() !== '' ? `Search Results` : 'Our Collection'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          {searchQuery.trim() !== '' 
            ? `Found ${displayProducts.length} product${displayProducts.length !== 1 ? 's' : ''} matching "${searchQuery}"`
            : 'Discover exquisite fragrances crafted by master perfumers'
          }
        </p>
      </div>

      {displayProducts.length === 0 && searchQuery.trim() !== '' ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No products match your search for "{searchQuery}"
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search terms or browse our full collection
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white dark:bg-dark-800 rounded-2xl shadow-soft hover:shadow-glow dark:hover:shadow-dark-glow transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.02]"
              onClick={() => onProductSelect(product)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute top-4 right-4 p-2 bg-white dark:bg-dark-700 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
                >
                  <Heart className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-moonlight-400" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {product.brand}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{product.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-moonlight-400 transition-colors">
                  {product.name}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ৳{product.price}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                      {product.volume}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 text-white p-3 rounded-full shadow-soft hover:shadow-glow dark:hover:shadow-dark-glow transition-all duration-300 transform hover:scale-105"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;