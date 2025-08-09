import React from 'react';
import { Shield, Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="relative mx-auto mb-8 w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 rounded-2xl animate-pulse opacity-20"></div>
          <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 p-6 rounded-2xl">
            <Shield className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Loading spinner */}
        <div className="flex items-center justify-center mb-6">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Loading Admin Portal
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Please wait while we initialize your secure management system.
        </p>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;