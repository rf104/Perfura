import React, { useEffect, useRef } from 'react';
import { ShoppingCartIcon, SunIcon, MoonIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDarkMode } from '../App';

interface NavbarProps {
  onCartClick: () => void;
  cartItemCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  products: any[];
  onProductSelect: (product: any) => void;
  onNavigate: (section: string) => void; // Add navigation handler
}

const Navbar: React.FC<NavbarProps> = ({ 
  onCartClick, 
  cartItemCount, 
  searchQuery, 
  onSearchChange, 
  products, 
  onProductSelect,
  onNavigate // Add navigation prop
}) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<any[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);

  // Sample products for search (same as ProductGrid)
  const sampleProducts = [
    {
      id: '1',
      name: 'Vampire Blood',
      brand: 'Perfura Special',
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
      price: 799,
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
      price: 799,
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
      price: 799,
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
      name: 'Ocean Mist',
      brand: 'Aqua Essence',
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
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
    } else {
      const filtered = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.notes.some((note: string) => note.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5); // Limit to 5 results
      setSearchResults(filtered);
      setShowSearchResults(true);
    }
  }, [searchQuery, allProducts]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProductClick = (product: any) => {
    onProductSelect(product);
    setShowSearchResults(false);
    onSearchChange(''); // Clear search
  };

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setShowSearchResults(false);
    onSearchChange(''); // Clear search when navigating
  };

  return (
    <nav className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-md border-b border-gray-200 dark:border-dark-700 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Make clickable to go home */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
              <img 
                src="/images/logo.jpeg" 
                alt="Perfura Logo" 
                className="w-12 h-12 rounded-full mr-3 shadow-glow dark:shadow-dark-glow object-cover border-2 border-primary-500/20 dark:border-moonlight-500/20"
              />
              <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-primary-600 to-moonlight-600 dark:from-primary-400 dark:to-moonlight-400 bg-clip-text text-transparent">
                Perfura
              </h1>
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => handleNavClick('home')}
                className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('collections')}
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Collections
              </button>
              <button 
                onClick={() => handleNavClick('offers')}
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Offers
              </button>
              <button 
                onClick={() => handleNavClick('about')}
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                About
              </button>
            </div>
          </div>

          {/* Search Bar - Hidden on small screens */}
          <div className="flex-1 max-w-md mx-8 hidden lg:block" ref={searchRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search perfumes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => searchQuery.trim() !== '' && setShowSearchResults(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-dark-600 rounded-full bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-moonlight-400 focus:border-transparent transition-colors duration-200"
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer transition-colors duration-200 border-b border-gray-100 dark:border-dark-600 last:border-b-0"
                    >
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg mr-3 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {product.brand}
                        </p>
                      </div>
                      <div className="text-sm font-bold text-primary-600 dark:text-moonlight-400 ml-3">
                        ৳{product.price}
                      </div>
                    </div>
                  ))}
                  
                  {searchResults.length === 5 && (
                    <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-700">
                      Showing top 5 results. Type more to refine search.
                    </div>
                  )}
                </div>
              )}
              
              {/* No Results Message */}
              {showSearchResults && searchResults.length === 0 && searchQuery.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-xl shadow-2xl z-50 p-4 text-center">
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    No products found for "{searchQuery}"
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-moonlight-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {/* Cart button */}
            <button
              onClick={onCartClick}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-moonlight-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 relative"
              aria-label="Shopping cart"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 dark:bg-moonlight-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;