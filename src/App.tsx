import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import AuthModal from './components/AuthModal';
import Cart from './components/Cart';
import { Product, CartItem, User } from './types';

// Dark mode context
const DarkModeContext = createContext<{
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const useDarkMode = () => useContext(DarkModeContext);

// Helper function to convert Supabase user to our User type
const convertSupabaseUser = (supabaseUser: SupabaseUser | null): User | null => {
  if (!supabaseUser || !supabaseUser.email) return null;
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    full_name: supabaseUser.user_metadata?.full_name
  };
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(convertSupabaseUser(session?.user ?? null));
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(convertSupabaseUser(session?.user ?? null));
    });

    // Load products
    loadProducts();

    return () => subscription.unsubscribe();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
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
          user={user}
          onAuthClick={() => setShowAuthModal(true)}
          onCartClick={() => setShowCart(true)}
          cartItemCount={getTotalItems()}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          products={products}
          onProductSelect={setSelectedProduct}
        />
        
        <main className="animate-fade-in">
          {!selectedProduct ? (
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
          ) : (
            <ProductDetail
              product={selectedProduct}
              user={user}
              onBack={() => setSelectedProduct(null)}
              onAddToCart={addToCart}
              onAuthRequired={() => setShowAuthModal(true)}
            />
          )}
        </main>

        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}

        {showCart && (
          <Cart
            items={cartItems}
            onClose={() => setShowCart(false)}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            totalPrice={getTotalPrice()}
            user={user}
            onAuthRequired={() => setShowAuthModal(true)}
          />
        )}
      </div>
    </DarkModeContext.Provider>
  );
}

export default App;