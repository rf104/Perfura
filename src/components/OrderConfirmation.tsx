import React from 'react';
import { CheckCircle, Package, Mail, Phone, MapPin, Calendar, Hash, Download, Copy } from 'lucide-react';
import { OrderData } from './CheckOut';

interface OrderConfirmationProps {
  orderData: OrderData;
  onClose: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderData, onClose }) => {
  const handleContinueShopping = () => {
    onClose();
  };

  const handleCopyOrderDetails = async () => {
    const orderText = `
Order Details - Perfura

Order ID: ${orderData.orderId}
Order Date: ${new Date(orderData.orderDate).toLocaleDateString()}

Customer Information:
Name: ${orderData.customerInfo.name}
Email: ${orderData.customerInfo.email}
Phone: ${orderData.customerInfo.phone}
Address: ${orderData.customerInfo.address}, ${orderData.customerInfo.city}, ${orderData.customerInfo.postalCode}

Ordered Items:
${orderData.items.map(item => 
  `• ${item.product.name} (${item.product.brand}) - Qty: ${item.quantity} × ৳${item.product.price} = ৳${item.product.price * item.quantity}`
).join('\n')}

Total Amount: ৳${orderData.totalPrice}
    `.trim();

    try {
      await navigator.clipboard.writeText(orderText);
      alert('✅ Order details copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback: show order details in alert
      alert('Order details:\n\n' + orderText);
    }
  };

  const handleDownloadReceipt = () => {
    const orderText = `
PERFURA - PREMIUM FRAGRANCE COLLECTION
=======================================

Order Confirmation Receipt

Order ID: ${orderData.orderId}
Order Date: ${new Date(orderData.orderDate).toLocaleString()}

CUSTOMER INFORMATION
--------------------
Name: ${orderData.customerInfo.name}
Email: ${orderData.customerInfo.email}
Phone: ${orderData.customerInfo.phone}
Address: ${orderData.customerInfo.address}
         ${orderData.customerInfo.city}, ${orderData.customerInfo.postalCode}

ORDERED ITEMS
-------------
${orderData.items.map(item => 
  `${item.product.name}
  Brand: ${item.product.brand}
  Volume: ${item.product.volume}
  Quantity: ${item.quantity}
  Unit Price: ৳${item.product.price}
  Subtotal: ৳${item.product.price * item.quantity}
  
`).join('')}

TOTAL AMOUNT: ৳${orderData.totalPrice}

Thank you for shopping with Perfura!
We will contact you within 24 hours to confirm your order.

For any queries, please contact us at sajedullaharef@gmail.com
    `;

    const blob = new Blob([orderText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Perfura_Order_${orderData.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Success Header */}
        <div className="text-center p-8 border-b border-gray-200 dark:border-dark-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">
            🎉 Order Confirmed!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Thank you for choosing Perfura. Your order has been received!
          </p>
          <div className="mt-4 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm rounded-lg p-3 inline-block">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              📧 <strong>Order notification sent to:</strong><br/>
              <span className="text-primary-600 dark:text-moonlight-400 font-semibold">sajedullaharef@gmail.com</span>
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Details */}
          <div className="bg-gray-50 dark:bg-dark-900 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Hash className="w-5 h-5 mr-2 text-primary-600 dark:text-moonlight-400" />
              Order Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Order ID:</span>
                <span className="font-bold text-primary-600 dark:text-moonlight-400 font-mono">
                  {orderData.orderId}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Order Date:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {new Date(orderData.orderDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Customer Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-300 min-w-[60px]">Name:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {orderData.customerInfo.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300 min-w-[50px]">Email:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {orderData.customerInfo.email}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300 min-w-[50px]">Phone:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {orderData.customerInfo.phone}
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-1" />
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Address:</span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {orderData.customerInfo.address}<br />
                    {orderData.customerInfo.city}, {orderData.customerInfo.postalCode}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Package className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Ordered Items ({orderData.items.length} items)
            </h3>
            <div className="space-y-3">
              {orderData.items.map((item, index) => (
                <div key={item.product.id} className="flex items-center space-x-3 bg-white dark:bg-dark-800 p-3 rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">{index + 1}</span>
                  </div>
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.product.brand} • {item.product.volume}
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Quantity: {item.quantity} × ৳{item.product.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary-600 dark:text-moonlight-400">
                      ৳{item.product.price * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-purple-200 dark:border-purple-700 mt-4 pt-4">
              <div className="flex justify-between items-center text-xl font-bold text-gray-900 dark:text-white">
                <span>Total Amount:</span>
                <span className="text-primary-600 dark:text-moonlight-400 text-2xl">৳{orderData.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-primary-50 to-moonlight-50 dark:from-primary-900/20 dark:to-moonlight-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-300 mb-3 flex items-center">
              🚀 What Happens Next?
            </h3>
            <ul className="text-sm text-primary-700 dark:text-primary-300 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✅</span>
                <span>Order confirmation sent to <strong>sajedullaharef@gmail.com</strong></span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">📞</span>
                <span>Our team will contact you within <strong>24 hours</strong> to confirm your order</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">📦</span>
                <span>We'll provide tracking information once your order is shipped</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 font-bold">🚚</span>
                <span>Expected delivery time is <strong>3-5 business days</strong></span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleContinueShopping}
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 text-white py-3 px-6 rounded-full font-semibold shadow-soft hover:shadow-glow dark:hover:shadow-dark-glow transition-all duration-300 transform hover:scale-105"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleCopyOrderDetails}
              className="flex-1 border-2 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:border-blue-500 dark:hover:border-blue-400 py-3 px-6 rounded-full font-semibold transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Details</span>
            </button>
            <button
              onClick={handleDownloadReceipt}
              className="flex-1 border-2 border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:border-green-500 dark:hover:border-green-400 py-3 px-6 rounded-full font-semibold transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;