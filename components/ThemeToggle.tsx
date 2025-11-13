

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
      className="text-black dark:text-white p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-300"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        // FIX: Replaced class with className for ion-icon custom element
        <ion-icon name="moon-outline" className="text-2xl block"></ion-icon>
      ) : (
        // FIX: Replaced class with className for ion-icon custom element
        <ion-icon name="sunny-outline" className="text-2xl block"></ion-icon>
      )}
    </button>
  );
};

export default ThemeToggle;