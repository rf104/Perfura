import { useState, useEffect, createContext, useContext } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import { Product, CartItem } from './types';

// Dark mode context
const DarkModeContext = createContext<{
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const useDarkMode = () => useContext(DarkModeContext);

function App() {
  const [products] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSection, setCurrentSection] = useState('home'); // Add current section state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem('perfura-dark-mode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('perfura-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle navigation
  const handleNavigation = (section: string) => {
    setCurrentSection(section);
    setSelectedProduct(null); // Close product detail view when navigating
    setSearchQuery(''); // Clear search query
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  // Render content based on current section
  const renderContent = () => {
    if (selectedProduct) {
      return (
        <ProductDetail
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      );
    }

    switch (currentSection) {
      case 'collections':
        return (
          <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 animate-slide-up">
                <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                  Our Collections
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Explore our curated collections of premium fragrances
                </p>
              </div>
              <ProductGrid 
                products={products}
                onProductSelect={setSelectedProduct}
                onAddToCart={addToCart}
                searchQuery={searchQuery}
              />
            </div>
          </section>
        );

      case 'offers':
        return (
          <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-7xl mx-auto text-center">
              <div className="animate-slide-up">
                <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                  Special Offers
                </h2>
                <div className="bg-gradient-to-r from-primary-50 to-moonlight-50 dark:from-primary-900/20 dark:to-moonlight-900/20 rounded-2xl p-8 mb-8">
                  <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                    🎉 Grand Opening Sale!
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    Get 20% off on all premium fragrances. Limited time offer!
                  </p>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-soft">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">Buy 2 Get 1 Free</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">On selected fragrances</p>
                    </div>
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-soft">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">Free Shipping</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">On orders above ৳1500</p>
                    </div>
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-soft">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">Member Exclusive</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Extra 10% off for members</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 animate-slide-up">
                <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                  About Perfura
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="animate-slide-up">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Perfura was born from a passion for exceptional fragrances and the belief that everyone deserves to find their perfect scent. We curate the finest perfumes from renowned perfumers around the world.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Our mission is to make luxury fragrances accessible to everyone, offering premium quality at affordable prices with exceptional customer service.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-r from-primary-50 to-moonlight-50 dark:from-primary-900/20 dark:to-moonlight-900/20 rounded-xl">
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">500+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Products</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-primary-50 to-moonlight-50 dark:from-primary-900/20 dark:to-moonlight-900/20 rounded-xl">
                      <div className="text-2xl font-bold text-moonlight-600 dark:text-moonlight-400">24/7</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Support</div>
                    </div>
                  </div>
                </div>
                <div className="animate-slide-up delay-200">
                  <div className="bg-gradient-to-br from-primary-100 to-moonlight-100 dark:from-primary-900/30 dark:to-moonlight-900/30 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Perfura?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Authentic premium fragrances</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-moonlight-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Competitive pricing</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Fast & secure delivery</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-moonlight-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Expert customer support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      default: // 'home'
        return (
          <>
            <Hero />
            <section className="py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-slide-up">
                  <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                    Our Premium Collection
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Discover exquisite fragrances crafted with the finest ingredients from around the world
                  </p>
                </div>
                <ProductGrid 
                  products={products}
                  onProductSelect={setSelectedProduct}
                  onAddToCart={addToCart}
                  searchQuery={searchQuery}
                />
              </div>
            </section>
          </>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center transition-all duration-500">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-moonlight-500 rounded-full animate-pulse"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-moonlight-400"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading Perfura...</p>
        </div>
      </div>
    );
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 transition-all duration-500">
        <Navbar 
          onCartClick={() => setShowCart(true)}
          cartItemCount={getTotalItems()}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          products={products}
          onProductSelect={setSelectedProduct}
          onNavigate={handleNavigation} // Pass navigation handler
        />
        
        <main className="animate-fade-in">
          {renderContent()}
        </main>

        {showCart && (
          <Cart
            items={cartItems}
            onClose={() => setShowCart(false)}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            totalPrice={getTotalPrice()}
          />
        )}
      </div>
    </DarkModeContext.Provider>
  );
}

export default App;