import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary-50 via-white to-moonlight-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 dark:bg-primary-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-moonlight-200 dark:bg-moonlight-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
            <span className="block">Discover Your</span>
            <span className="block bg-gradient-to-r from-primary-600 to-moonlight-600 dark:from-primary-400 dark:to-moonlight-400 bg-clip-text text-transparent">
              Signature Scent
            </span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 animate-slide-up delay-200">
            Perfura brings you the world's most exquisite fragrances, crafted with passion and perfected through time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-300">
            <button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-soft hover:shadow-glow dark:hover:shadow-dark-glow transition-all duration-300 transform hover:scale-105">
              Explore Collection
            </button>
            <button className="border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:border-primary-500 dark:hover:border-moonlight-400 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-primary-50 dark:hover:bg-dark-700">
              Learn More
            </button>
          </div>
        </div>
        
        {/* Stats section */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center animate-slide-up delay-500">
          <div className="bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-soft transition-all duration-300 hover:shadow-glow dark:hover:shadow-dark-glow">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">100+</div>
            <div className="text-gray-600 dark:text-gray-300">Premium Fragrances</div>
          </div>
          <div className="bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-soft transition-all duration-300 hover:shadow-glow dark:hover:shadow-dark-glow">
            <div className="text-3xl font-bold text-moonlight-600 dark:text-moonlight-400 mb-2">50K+</div>
            <div className="text-gray-600 dark:text-gray-300">Happy Customers</div>
          </div>
          <div className="bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-soft transition-all duration-300 hover:shadow-glow dark:hover:shadow-dark-glow">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-300">Customer Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;