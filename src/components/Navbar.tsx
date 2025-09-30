import React, { useEffect, useRef, useState } from 'react';
import { ShoppingCartIcon, SunIcon, MoonIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDarkMode } from '../App';

interface NavbarProps {
  onCartClick: () => void;
  cartItemCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  products: any[];
  onProductSelect: (product: any) => void;
  onNavigate: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onCartClick, 
  cartItemCount, 
  searchQuery, 
  onSearchChange, 
  products, 
  onProductSelect,
  onNavigate
}) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

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
      if (searchRef.current && !searchRef.current.contains(event.target as Node) &&
          mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
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
    setShowMobileSearch(false);
    setIsMenuOpen(false);
  };

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setShowSearchResults(false);
    onSearchChange(''); // Clear search when navigating
    setIsMenuOpen(false);
    setShowMobileSearch(false);
  };

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    setIsMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setShowMobileSearch(false);
  };

  return (
    <>
      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo Section - Always visible but responsive */}
            <div className="flex items-center flex-shrink-0">
              <div 
                className="flex items-center cursor-pointer group" 
                onClick={() => handleNavClick('home')}
              >
                {/* Logo image */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mr-2 sm:mr-3 overflow-hidden">
                  <img 
                    src="/images/logo.jpeg" 
                    alt="Perfura Logo" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                    }}
                  />
                  <span className="text-white font-bold text-sm sm:text-lg hidden">P</span>
                </div>
                {/* Brand name - hidden on very small screens, visible on sm+ */}
                <span className="hidden sm:block text-lg lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                  Perfura
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links - Hidden on mobile and tablet */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-6 xl:space-x-8">
                <button 
                  onClick={() => handleNavClick('home')}
                  className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                </button>
                <button 
                  onClick={() => handleNavClick('collections')}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                >
                  Collections
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                </button>
                <button 
                  onClick={() => handleNavClick('offers')}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                >
                  Offers
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                </button>
                <button 
                  onClick={() => handleNavClick('about')}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                >
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                </button>
              </div>
            </div>

            {/* Desktop Search Bar - Hidden on mobile and tablet */}
            <div className="flex-1 max-w-md mx-6 hidden lg:block" ref={searchRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search perfumes..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => searchQuery.trim() !== '' && setShowSearchResults(true)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-sm transition-all duration-200"
                />
                
                {/* Desktop Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto backdrop-blur-xl">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
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
                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400 ml-3">
                          ৳{product.price}
                        </div>
                      </div>
                    ))}
                    
                    {searchResults.length === 5 && (
                      <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                        Showing top 5 results. Type more to refine search.
                      </div>
                    )}
                  </div>
                )}
                
                {/* No Results Message */}
                {showSearchResults && searchResults.length === 0 && searchQuery.trim() !== '' && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl z-50 p-4 text-center backdrop-blur-xl">
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      No products found for "{searchQuery}"
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right side buttons - Always visible */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile Search Button - Visible on tablet and mobile */}
              <button
                onClick={toggleMobileSearch}
                className="lg:hidden p-2 sm:p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              {/* Dark mode toggle - Always visible */}
              <button
                onClick={toggleDarkMode}
                className="p-2 sm:p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>

              {/* Cart button - Always visible with count */}
              <button
                onClick={onCartClick}
                className="p-2 sm:p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative"
                aria-label={`Shopping cart with ${cartItemCount} items`}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold animate-pulse">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button - Visible on tablet and mobile */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 sm:p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Menu"
              >
                <svg className={`w-5 h-5 transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Appears when search button is clicked */}
          {showMobileSearch && (
            <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-3" ref={mobileSearchRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search perfumes..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => searchQuery.trim() !== '' && setShowSearchResults(true)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-sm"
                  autoFocus
                />
                
                {/* Mobile Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto backdrop-blur-xl">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
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
                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400 ml-3">
                          ৳{product.price}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Mobile No Results Message */}
                {showSearchResults && searchResults.length === 0 && searchQuery.trim() !== '' && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl z-50 p-4 text-center backdrop-blur-xl">
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      No products found for "{searchQuery}"
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Dropdown - Functional buttons */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-3 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80">
              <div className="flex flex-col space-y-1">
                <button 
                  onClick={() => handleNavClick('home')}
                  className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-3 text-sm font-medium text-left rounded-lg transition-colors duration-200 w-full"
                >
                  🏠 Home
                </button>
                <button 
                  onClick={() => handleNavClick('collections')}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-3 text-sm font-medium text-left rounded-lg transition-colors duration-200 w-full"
                >
                  📦 Collections
                </button>
                <button 
                  onClick={() => handleNavClick('offers')}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-3 text-sm font-medium text-left rounded-lg transition-colors duration-200 w-full"
                >
                  🎯 Offers
                </button>
                <button 
                  onClick={() => handleNavClick('about')}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-3 text-sm font-medium text-left rounded-lg transition-colors duration-200 w-full"
                >
                  ℹ️ About
                </button>
                <button 
                  onClick={() => handleNavClick('contact')}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-3 text-sm font-medium text-left rounded-lg transition-colors duration-200 w-full"
                >
                  📞 Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;