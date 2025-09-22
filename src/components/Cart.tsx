import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem, User } from '../types';
import Checkout, { OrderData } from './CheckOut';
import OrderConfirmation from './OrderConfirmation';

interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  totalPrice: number;
  user: User | null;
  onAuthRequired: () => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  totalPrice,
  user,
  onAuthRequired,
}) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  const handleCheckout = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    setShowCheckout(true);
  };

  const handleOrderConfirm = (data: OrderData) => {
    setOrderData(data);
    setShowCheckout(false);
    setShowOrderConfirmation(true);
    
    // Clear cart items (you might want to do this in the parent component)
    items.forEach(item => onRemoveItem(item.product.id));
  };

  const handleOrderConfirmationClose = () => {
    setShowOrderConfirmation(false);
    setOrderData(null);
    onClose();
  };

  if (showOrderConfirmation && orderData) {
    return <OrderConfirmation orderData={orderData} onClose={handleOrderConfirmationClose} />;
  }

  if (showCheckout) {
    return (
      <Checkout
        items={items}
        totalPrice={totalPrice}
        user={user}
        onClose={() => setShowCheckout(false)}
        onOrderConfirm={handleOrderConfirm}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white flex items-center">
            <ShoppingBag className="w-6 h-6 mr-2" />
            Shopping Cart ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Add some beautiful fragrances to get started
              </p>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 text-white px-6 py-2 rounded-full font-semibold shadow-soft hover:shadow-glow dark:hover:shadow-dark-glow transition-all duration-300 transform hover:scale-105"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center space-x-4 bg-gray-50 dark:bg-dark-900 p-4 rounded-xl"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {item.product.brand} • {item.product.volume}
                    </p>
                    <p className="text-sm font-bold text-primary-600 dark:text-moonlight-400">
                      ৳{item.product.price}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-dark-700 rounded transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-dark-700 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-dark-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total:
              </span>
              <span className="text-2xl font-bold text-primary-600 dark:text-moonlight-400">
                ৳{totalPrice}
              </span>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 text-white py-3 rounded-full font-semibold shadow-soft hover:shadow-glow dark:hover:shadow-dark-glow transition-all duration-300 transform hover:scale-105"
              >
                {user ? 'Proceed to Checkout' : 'Sign In to Order'}
              </button>
              
              <button
                onClick={onClose}
                className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;