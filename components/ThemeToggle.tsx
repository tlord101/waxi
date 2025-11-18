import React from 'react';
// FIX: Import Theme from types.ts to break circular dependency.
import { Theme } from '../types';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="text-white p-1.5 sm:p-2 rounded-full hover:bg-white/20 transition-colors duration-300 flex items-center justify-center"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <i className="bi bi-moon-stars text-lg sm:text-xl"></i>
      ) : (
        <i className="bi bi-brightness-high text-lg sm:text-xl"></i>
      )}
    </button>
  );
};

export default ThemeToggle;