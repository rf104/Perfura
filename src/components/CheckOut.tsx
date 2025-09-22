import React, { useState } from 'react';
import { X, ArrowLeft, MapPin, Mail, Package, CreditCard } from 'lucide-react';
import { CartItem, User } from '../types';

interface CheckoutProps {
  items: CartItem[];
  totalPrice: number;
  user: User | null;
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

const Checkout: React.FC<CheckoutProps> = ({ items, totalPrice, user, onClose, onOrderConfirm }) => {
  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
              Checkout
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Order Summary */}
          <div className="lg:w-2/5 bg-gray-50 dark:bg-dark-900 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Order Summary
            </h3>
            
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-3 bg-white dark:bg-dark-800 p-3 rounded-xl">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.product.brand} • {item.product.volume}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Qty: {item.quantity} × ৳{item.product.price}
                    </p>
                  </div>
                  <div className="text-sm font-bold text-primary-600 dark:text-moonlight-400">
                    ৳{item.product.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-dark-700 pt-4">
              <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white">
                <span>Total Amount:</span>
                <span className="text-primary-600 dark:text-moonlight-400">৳{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:w-3/5 p-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-moonlight-400 ${
                        errors.name ? 'border-red-500' : 'border-gray-300 dark:border-dark-600'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-moonlight-400 ${
                        errors.email ? 'border-red-500' : 'border-gray-300 dark:border-dark-600'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-moonlight-400 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-dark-600'
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-moonlight-400 resize-none ${
                        errors.address ? 'border-red-500' : 'border-gray-300 dark:border-dark-600'
                      }`}
                      placeholder="Enter your complete address"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-moonlight-400 ${
                          errors.city ? 'border-red-500' : 'border-gray-300 dark:border-dark-600'
                        }`}
                        placeholder="Enter your city"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-moonlight-400 ${
                          errors.postalCode ? 'border-red-500' : 'border-gray-300 dark:border-dark-600'
                        }`}
                        placeholder="Enter postal code"
                      />
                      {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-dark-700 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-full font-semibold shadow-soft hover:shadow-glow dark:hover:shadow-dark-glow transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing & Sending Order...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Confirm Order & Send Email</span>
                    </>
                  )}
                </button>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    By confirming your order, you agree to our terms and conditions.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                      📧 Order confirmation will be sent to <strong>sajedullaharef@gmail.com</strong><br/>
                      ✨ You'll receive an order confirmation on this page immediately
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