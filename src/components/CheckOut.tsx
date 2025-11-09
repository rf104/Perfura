import React, { useState } from 'react';
import { X, ArrowLeft, MapPin, Mail, Package, CreditCard } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutProps {
  items: CartItem[];
  totalPrice: number;
  onClose: () => void;
  onOrderConfirm: (orderData: OrderData) => void;
}

export interface OrderData {
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: CartItem[];
  totalPrice: number;
  orderDate: string;
}

const Checkout: React.FC<CheckoutProps> = ({ items, totalPrice, onClose, onOrderConfirm }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) newErrors.phone = 'Invalid phone number format';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderId = () => {
    return `PF${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const orderData: OrderData = {
        orderId: generateOrderId(),
        customerInfo: formData,
        items,
        totalPrice,
        orderDate: new Date().toISOString(),
      };

      // Send email notification
      await sendOrderEmail(orderData);
      
      // Call the parent component's order confirm handler
      onOrderConfirm(orderData);
      
    } catch (error) {
      console.error('Error processing order:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendOrderEmail = async (orderData: OrderData) => {
    let emailSent = false;
    
    // Method 1: Try HTTP POST to a simple email service
    try {
      await sendEmailViaHTTP(orderData);
      emailSent = true;
      console.log('✅ Email sent successfully via HTTP service');
    } catch (httpError) {
      console.log('❌ HTTP email service failed:', httpError);
    }

    // Method 2: Try Web3Forms (Free and reliable)
    if (!emailSent) {
      try {
        await sendEmailViaWeb3Forms(orderData);
        emailSent = true;
        console.log('✅ Email sent successfully via Web3Forms');
      } catch (web3Error) {
        console.log('❌ Web3Forms failed:', web3Error);
      }
    }

    // Method 3: Save to localStorage and show admin notification
    if (!emailSent) {
      saveOrderToLocalStorage(orderData);
      sendEmailViaMailto(orderData); // Opens email client as fallback
      console.log('📧 Email client opened and order saved locally');
    }
  };

  const sendEmailViaHTTP = async (orderData: OrderData) => {
    // Simple HTTP POST to send email


    // Try FormSubmit.co (free service)
    const formData = new FormData();
    formData.append('_replyto', orderData.customerInfo.email);
    formData.append('_subject', `New Order #${orderData.orderId} - Perfura`);
    formData.append('_next', window.location.origin + '/thank-you');
    formData.append('_captcha', 'false');
    formData.append('order_details', JSON.stringify(orderData, null, 2));
    
    const response = await fetch('https://formsubmit.co/ajax/sajedullaharef@gmail.com', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP email service failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Email sent via FormSubmit.co:', result);
    return result;
  };



  const sendEmailViaWeb3Forms = async (orderData: OrderData) => {
    // Using a demo access key - replace with your actual Web3Forms access key
    // Get your free access key from https://web3forms.com
    const accessKey = 'c9e5320b-27b8-4a58-a8c9-cfa6d6c4e3e1'; // Demo key - replace with yours
    
    const formData = new FormData();
    formData.append('access_key', accessKey);
    formData.append('from_name', 'Perfura Website');
    formData.append('email', orderData.customerInfo.email);
    formData.append('subject', `New Order #${orderData.orderId} - Perfura`);
    formData.append('message', `
New Order Received - Perfura

Order ID: ${orderData.orderId}
Order Date: ${new Date(orderData.orderDate).toLocaleString()}

Customer Information:
Name: ${orderData.customerInfo.name}
Email: ${orderData.customerInfo.email}
Phone: ${orderData.customerInfo.phone}
Address: ${orderData.customerInfo.address}
City: ${orderData.customerInfo.city}
Postal Code: ${orderData.customerInfo.postalCode}

Order Details:
${orderData.items.map(item => 
  `• ${item.product.name} (${item.product.brand})
    Quantity: ${item.quantity}
    Price: ৳${item.product.price} each
    Subtotal: ৳${item.product.price * item.quantity}`
).join('\n\n')}

Total Amount: ৳${orderData.totalPrice}

Please process this order at your earliest convenience.

Best regards,
Perfura Website System
    `);

    // Add recipient email - this will send to you
    formData.append('to', 'sajedullaharef@gmail.com');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(`Web3Forms failed: ${result.message || 'Unknown error'}`);
    }

    console.log('Email sent successfully via Web3Forms:', result);
    return result;
  };

  const sendEmailViaMailto = (orderData: OrderData) => {
    const emailBody = `
New Order Received - Perfura

Order ID: ${orderData.orderId}
Order Date: ${new Date(orderData.orderDate).toLocaleString()}

Customer Information:
Name: ${orderData.customerInfo.name}
Email: ${orderData.customerInfo.email}
Phone: ${orderData.customerInfo.phone}
Address: ${orderData.customerInfo.address}, ${orderData.customerInfo.city}, ${orderData.customerInfo.postalCode}

Order Details:
${orderData.items.map(item => 
  `${item.product.name} (${item.product.brand}) - Quantity: ${item.quantity} - Price: ৳${item.product.price} each`
).join('\n')}

Total Amount: ৳${orderData.totalPrice}

Please process this order at your earliest convenience.
    `.trim();

    const subject = `New Order #${orderData.orderId} - Perfura`;
    const mailtoLink = `mailto:sajedullaharef@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open user's email client
    window.open(mailtoLink, '_blank');
    
    console.log('Opened email client with pre-filled order details');
    
    // Show user notification that email client was opened
    alert('📧 Your email client has been opened with the order details. Please send the email to complete your order notification.');
  };

  const saveOrderToLocalStorage = (orderData: OrderData) => {
    try {
      const existingOrders = JSON.parse(localStorage.getItem('perfura_orders') || '[]');
      existingOrders.push({
        ...orderData,
        timestamp: Date.now(),
        status: 'pending_email'
      });
      localStorage.setItem('perfura_orders', JSON.stringify(existingOrders));
      
      console.log('✅ Order saved to localStorage for backup');
      
      // Show admin notification
      if (window.confirm('⚠️ Email service unavailable. Order has been saved locally. Would you like to view the order details to manually process it?')) {
        console.log('📋 Order Details for Manual Processing:');
        console.table(orderData);
      }
    } catch (error) {
      console.error('Failed to save order to localStorage:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-white/20 dark:border-gray-700/50">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-700/50">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-xl transition-all duration-300 hover:scale-105 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Checkout
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Complete your order
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-xl transition-all duration-300 hover:scale-105 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm"
            aria-label="Close checkout"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-120px)]">
          {/* Order Summary - Enhanced Mobile Layout */}
          <div className="lg:w-2/5 bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-700/80 p-4 sm:p-6 overflow-y-auto border-r border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Order Summary
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            </h3>
            
            <div className="space-y-3 sm:space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-3 bg-white/70 dark:bg-gray-800/70 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-sm border border-white/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg sm:rounded-xl shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {item.product.brand} • {item.product.volume}
                    </p>
                    <div className="flex items-center justify-between mt-1 sm:mt-2">
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
                        Qty: {item.quantity} × ৳{item.product.price}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm sm:text-lg font-black text-blue-600 dark:text-blue-400">
                      ৳{item.product.price * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Total Section */}
            <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4 sm:pt-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-2xl p-4 sm:p-6 mt-4">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  <span>Subtotal:</span>
                  <span className="font-semibold">৳{totalPrice}</span>
                </div>
                <div className="flex justify-between items-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  <span>Shipping:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">Free</span>
                </div>
                <div className="border-t border-gray-200/50 dark:border-gray-600/50 pt-2 sm:pt-3">
                  <div className="flex justify-between items-center text-lg sm:text-xl lg:text-2xl font-black text-gray-900 dark:text-white">
                    <span>Total:</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                      ৳{totalPrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Checkout Form */}
          <div className="lg:w-3/5 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Contact Information Section */}
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-4 sm:p-6 shadow-lg backdrop-blur-sm border border-white/50 dark:border-gray-700/50">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm ${
                        errors.name ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-blue-400 dark:hover:border-blue-500'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-medium">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm ${
                        errors.email ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-blue-400 dark:hover:border-blue-500'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-medium">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Information Section */}
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-4 sm:p-6 shadow-lg backdrop-blur-sm border border-white/50 dark:border-gray-700/50">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Shipping Information
                </h3>
                
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm ${
                        errors.phone ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-blue-400 dark:hover:border-blue-500'
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-medium">{errors.phone}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                      Full Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-3 border-2 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm resize-none ${
                        errors.address ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-blue-400 dark:hover:border-blue-500'
                      }`}
                      placeholder="Enter your complete address"
                    />
                    {errors.address && <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-medium">{errors.address}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm ${
                          errors.city ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-blue-400 dark:hover:border-blue-500'
                        }`}
                        placeholder="Enter your city"
                      />
                      {errors.city && <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-medium">{errors.city}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm ${
                          errors.postalCode ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-blue-400 dark:hover:border-blue-500'
                        }`}
                        placeholder="Enter postal code"
                      />
                      {errors.postalCode && <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-medium">{errors.postalCode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Submit Section */}
              <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-800/20 dark:to-purple-800/20 border-2 border-blue-200/50 dark:border-blue-700/50 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 sm:py-5 px-6 sm:px-8 rounded-2xl font-black shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-3 text-base sm:text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Complete Order • ৳{totalPrice}</span>
                    </>
                  )}
                </button>
                
                <div className="mt-4 sm:mt-6 text-center space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    By confirming your order, you agree to our 
                    <button className="text-blue-600 dark:text-blue-400 hover:underline ml-1 font-semibold">
                      terms and conditions
                    </button>
                  </p>
                  <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/60 dark:border-blue-700/60 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                    <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                      <span className="font-bold">📧 Order Processing:</span> Your order details will be sent to our team for processing.<br/>
                      <span className="font-bold">✨ Quick Response:</span> We'll contact you within 24 hours to confirm your order.<br/>
                      <span className="font-bold">🚚 Delivery:</span> Free delivery within 2-3 business days in Dhaka area.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;