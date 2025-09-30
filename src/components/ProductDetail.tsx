import React, { useState } from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Product Not Found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base">The product you're looking for could not be found.</p>
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
            >
              Go Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = product.image_url ? [product.image_url] : [];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 text-gray-900 dark:text-white overflow-hidden">
      {/* Background animations - simplified for mobile */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-purple-50/50 to-pink-100/60 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-pink-900/40"></div>
        
        {/* Reduced animations on mobile for better performance */}
        <div className="hidden sm:block absolute -left-32 -top-32 w-[500px] h-[500px] rounded-full blur-2xl opacity-95 animate-float-slow mix-blend-screen" 
             style={{ background: 'radial-gradient(circle at 40% 40%, rgba(99,102,241,0.9), rgba(168,85,247,0.6) 40%, rgba(236,72,153,0.4) 70%, transparent 90%)' }} />
        <div className="hidden sm:block absolute right-[-200px] top-20 w-[400px] h-[400px] rounded-full blur-2xl opacity-85 animate-float-reverse-slow mix-blend-screen" 
             style={{ background: 'radial-gradient(circle at 60% 60%, rgba(59,130,246,0.8), rgba(147,51,234,0.6) 50%, rgba(168,85,247,0.4) 75%, transparent 90%)' }} />
        
        {/* Mobile-optimized background elements */}
        <div className="sm:hidden absolute -left-16 -top-16 w-[200px] h-[200px] rounded-full blur-xl opacity-70 mix-blend-screen" 
             style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.6), rgba(168,85,247,0.4) 50%, transparent 80%)' }} />
        <div className="sm:hidden absolute -right-16 top-10 w-[150px] h-[150px] rounded-full blur-xl opacity-60 mix-blend-screen" 
             style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.5), rgba(147,51,234,0.3) 60%, transparent 80%)' }} />

        <style>{`
          @keyframes float { 0% { transform: translateY(0px) translateX(0px) rotate(0deg); } 33% { transform: translateY(-15px) translateX(8px) rotate(1deg); } 66% { transform: translateY(-8px) translateX(-5px) rotate(-0.5deg); } 100% { transform: translateY(0px) translateX(0px) rotate(0deg); } }
          @keyframes floatReverse { 0% { transform: translateY(0px) translateX(0px) rotate(0deg); } 33% { transform: translateY(-12px) translateX(-8px) rotate(-1deg); } 66% { transform: translateY(-6px) translateX(6px) rotate(0.5deg); } 100% { transform: translateY(0px) translateX(0px) rotate(0deg); } }
          @keyframes floatSlow { 0% { transform: translateY(0px) translateX(0px); } 50% { transform: translateY(-20px) translateX(10px); } 100% { transform: translateY(0px) translateX(0px); } }
          @keyframes floatReverseSlow { 0% { transform: translateY(0px) translateX(0px); } 50% { transform: translateY(-16px) translateX(-8px); } 100% { transform: translateY(0px) translateX(0px); } }
          .animate-float { animation: float 8s ease-in-out infinite; }
          .animate-float-reverse { animation: floatReverse 9s ease-in-out infinite; }
          .animate-float-slow { animation: floatSlow 12s ease-in-out infinite; }
          .animate-float-reverse-slow { animation: floatReverseSlow 14s ease-in-out infinite; }
        `}</style>
      </div>

      {/* Mobile-Responsive Navigation Header */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl sticky top-0 z-40 shadow-lg border-b border-white/20 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 sm:gap-3 text-sky-600 dark:text-sky-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group"
              aria-label="Back to products"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-semibold text-sm sm:text-base">Back</span>
            </button>
            
            {/* Mobile title */}
            <h1 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate px-2">
              Product Details
            </h1>
            
            {/* Spacer for balance */}
            <div className="w-12 sm:w-16"></div>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative border border-white/40 dark:border-gray-700/60">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Images Section */}
            <div className="p-4 sm:p-8 lg:p-12 bg-gradient-to-br from-white/30 to-blue-50/30 dark:from-gray-800/30 dark:to-gray-700/30">
              <div className="space-y-4 sm:space-y-6">
                <div className="aspect-square bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-700/80 dark:to-gray-600/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white/70 dark:border-gray-600/70 relative group">
                  {images.length > 0 ? (
                    <>
                      <img
                        src={images[selectedImage]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-600 dark:to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                          <svg className="w-10 sm:w-16 h-10 sm:h-16 text-blue-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg font-semibold">No image available</p>
                      </div>
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-16 sm:w-20 h-16 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-3 transition-all duration-500 ${
                          selectedImage === index
                            ? 'border-blue-500 dark:border-blue-400 shadow-xl scale-105 sm:scale-110 rotate-1 sm:rotate-2'
                            : 'border-gray-200/60 dark:border-gray-600/60 hover:border-blue-300 dark:hover:border-blue-500 hover:scale-105 hover:rotate-1'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Information - Mobile Optimized */}
            <div className="p-4 sm:p-8 lg:p-12 bg-gradient-to-br from-white/40 to-gray-50/40 dark:from-gray-800/40 dark:to-gray-700/40">
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Product Title and Price */}
                <div className="space-y-3 sm:space-y-4">
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-300 dark:to-purple-300 leading-tight drop-shadow-sm">
                    {product.name}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 drop-shadow-sm">
                      ৳{product.price.toFixed(2)}
                    </span>
                    <span className="text-sm sm:text-lg font-bold text-gray-600 dark:text-gray-300 bg-gray-100/80 dark:bg-gray-700/80 px-2 sm:px-3 py-1 rounded-full shadow-lg backdrop-blur-sm w-fit">BDT</span>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="bg-gradient-to-r from-blue-50/60 to-purple-50/60 dark:from-gray-700/60 dark:to-gray-600/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-blue-100/60 dark:border-gray-600/60 backdrop-blur-sm">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                      <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"></div>
                      <span className="text-sm sm:text-base lg:text-xl">Description</span>
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm sm:text-base font-medium">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="bg-gradient-to-br from-indigo-50/60 to-blue-50/60 dark:from-gray-700/60 dark:to-gray-600/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-indigo-100/60 dark:border-gray-600/60 backdrop-blur-sm">
                  <label htmlFor="quantity" className="block text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full shadow-lg"></div>
                    <span className="text-sm sm:text-base lg:text-xl">Quantity</span>
                  </label>
                  <div className="flex items-center w-fit border-2 border-white/70 dark:border-gray-600/70 rounded-xl sm:rounded-2xl bg-white/70 dark:bg-gray-600/70 shadow-xl backdrop-blur-sm">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 sm:px-5 py-2 sm:py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-500/80 rounded-l-xl sm:rounded-l-2xl transition-all duration-300 text-lg sm:text-xl font-bold hover:scale-105"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || '1')))}
                      className="w-16 sm:w-20 px-2 sm:px-3 py-2 sm:py-3 text-center border-x-2 border-white/70 dark:border-gray-600/70 bg-white/70 dark:bg-gray-600/70 text-gray-900 dark:text-white focus:outline-none text-base sm:text-lg font-bold backdrop-blur-sm"
                      aria-label="Quantity"
                    />
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 sm:px-5 py-2 sm:py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-500/80 rounded-r-xl sm:rounded-r-2xl transition-all duration-300 text-lg sm:text-xl font-bold hover:scale-105"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-blue-200/50 dark:border-blue-500/50">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-white/95 hover:bg-white text-blue-600 hover:text-blue-700 font-black py-3 sm:py-5 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-lg border-2 border-white/80 backdrop-blur-sm group"
                  >
                    <svg className="w-5 sm:w-6 h-5 sm:h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m4.5-5a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="truncate">
                      Add {quantity > 1 ? `${quantity} items` : 'to Cart'} • ৳{(product.price * quantity).toFixed(2)}
                    </span>
                  </button>
                  <div className="text-center pt-2 sm:pt-3">
                    <p className="text-white/90 text-sm sm:text-base">
                      Total: <span className="text-lg sm:text-2xl font-black text-white drop-shadow-lg">৳{(product.price * quantity).toFixed(2)}</span>
                    </p>
                  </div>
                </div>

                {/* Features - Mobile Optimized */}
                <div className="bg-gradient-to-r from-gray-50/60 to-blue-50/60 dark:from-gray-700/60 dark:to-gray-600/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-gray-200/60 dark:border-gray-600/60 backdrop-blur-sm">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3">
                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full shadow-lg"></div>
                    <span className="text-sm sm:text-base lg:text-xl">Features</span>
                  </h3>
                  <ul className="grid grid-cols-1 gap-3 sm:gap-4">
                    <li className="flex items-center gap-3 sm:gap-4 bg-white/70 dark:bg-gray-600/70 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-sm border border-white/60 dark:border-gray-500/60">
                      <div className="w-3 sm:w-4 h-3 sm:h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex-shrink-0 shadow-lg"></div>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm sm:text-base">High quality materials</span>
                    </li>
                    <li className="flex items-center gap-3 sm:gap-4 bg-white/70 dark:bg-gray-600/70 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-sm border border-white/60 dark:border-gray-500/60">
                      <div className="w-3 sm:w-4 h-3 sm:h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex-shrink-0 shadow-lg"></div>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm sm:text-base">Fast shipping</span>
                    </li>
                    <li className="flex items-center gap-3 sm:gap-4 bg-white/70 dark:bg-gray-600/70 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-sm border border-white/60 dark:border-gray-500/60">
                      <div className="w-3 sm:w-4 h-3 sm:h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex-shrink-0 shadow-lg"></div>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm sm:text-base">Satisfaction guaranteed</span>
                    </li>
                  </ul>
                </div>

                {/* Additional Info - Mobile Layout */}
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center shadow-xl border border-green-200/50 dark:border-green-700/50 backdrop-blur-sm">
                    <div className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-xl">
                      <svg className="w-4 sm:w-6 h-4 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm sm:text-lg font-bold text-green-800 dark:text-green-200">In Stock</p>
                    <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 font-medium">Ready to ship</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center shadow-xl border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
                    <div className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-xl">
                      <svg className="w-4 sm:w-6 h-4 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm sm:text-lg font-bold text-blue-800 dark:text-blue-200">Fast Delivery</p>
                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 font-medium">2-3 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Mobile-optimized styles */
        @media (max-width: 640px) {
          .backdrop-blur-xl { backdrop-filter: blur(8px); }
          .shadow-2xl { box-shadow: 0 15px 35px rgba(2,6,23,0.15); }
        }
        
        /* Enhanced text visibility */
        .text-gray-900 { color: rgb(17 24 39) !important; }
        .text-gray-800 { color: rgb(31 41 55) !important; }
        .dark .text-white { color: rgb(255 255 255) !important; }
        .dark .text-gray-200 { color: rgb(229 231 235) !important; }
        .bg-clip-text { -webkit-background-clip: text; background-clip: text; }
        .text-transparent { color: transparent; }
      `}</style>
    </div>
  );
};

export default ProductDetail;
