import React from 'react';
import { Theme } from '../App';

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
        <ion-icon name="moon-outline" style={{ fontSize: '1.5rem', display: 'block' }}></ion-icon>
      ) : (
        <ion-icon name="sunny-outline" style={{ fontSize: '1.5rem', display: 'block' }}></ion-icon>
      )}
    </button>
  );
};

export default ThemeToggle;
