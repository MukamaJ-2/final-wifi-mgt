import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';

export const ThemeToggle = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="group relative overflow-hidden p-3 rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:scale-110 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/25 dark:hover:shadow-blue-500/25"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-pink-500/20 dark:from-blue-400/20 dark:via-purple-500/20 dark:to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      
      {/* Icon container */}
      <div className="relative z-10 w-6 h-6 flex items-center justify-center">
        {theme === 'light' ? (
          <div className="relative">
            <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110" />
            <div className="absolute inset-0 animate-pulse">
              <Sparkles className="w-3 h-3 text-blue-400 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        ) : (
          <div className="relative">
            <Sun className="w-5 h-5 text-yellow-500 transition-all duration-500 group-hover:rotate-180 group-hover:scale-110" />
            <div className="absolute inset-0 animate-pulse">
              <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        )}
      </div>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
    </button>
  );
};