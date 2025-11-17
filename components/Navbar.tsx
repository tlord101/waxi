import React, { useState, useEffect } from 'react';
// FIX: Import Page and Theme from types.ts to break circular dependency.
import { Page, Theme } from '../types';
import ThemeToggle from './ThemeToggle';
import { User } from '../types';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isAdminLoggedIn: boolean;
  currentUser: User | null;
  onAdminLogout: () => void;
  onUserLogout: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage, isAdminLoggedIn, currentUser, onAdminLogout, onUserLogout, theme, toggleTheme }) => {
  // Navbar no longer uses an internal fullscreen menu. The MENU button
  // will navigate to the Dashboard and open the dashboard sidebar.

  useEffect(() => {
    // Dynamically load the GTranslate script to ensure it runs after the wrapper element is rendered by React.
    // This prevents a race condition where the script can't find its target element on initial page load.
    
    // Check if the script is already present to avoid adding it multiple times during development hot reloads.
    if (document.getElementById('gtranslate-script')) return;

    // Define settings on the window object before the script loads.
    (window as any).gtranslateSettings = {
      "default_language": "en",
      "native_language_names": false,
      "detect_browser_language": true,
      "languages": ["en", "fr", "it", "es", "zh-CN", "pt", "th", "hi", "ar", "id", "hu", "ms"],
      "wrapper_selector": ".gtranslate_wrapper", 
      "flag_style": "none"
    };

    const script = document.createElement('script');
    script.id = 'gtranslate-script';
    script.src = 'https://cdn.gtranslate.net/widgets/latest/dropdown.js';
    script.defer = true;
    
    document.body.appendChild(script);

    // Basic cleanup to remove the script if the component were to unmount.
    // Use safe removal to avoid exceptions if the node has already been removed or moved.
    return () => {
      const gtranslateScript = document.getElementById('gtranslate-script');
      if (gtranslateScript) {
        // Prefer Element.remove() which is safe if the node is not attached.
        // Fallback to parentNode removal if remove() isn't available for any reason.
        if (typeof (gtranslateScript as any).remove === 'function') {
          (gtranslateScript as any).remove();
        } else if (gtranslateScript.parentNode) {
          gtranslateScript.parentNode.removeChild(gtranslateScript);
        }
      }
    };
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleUserLogoutAndClose = () => {
    onUserLogout();
  }
  
  const handleAdminLogoutAndClose = () => {
    onAdminLogout();
  }

  const navLinkText: Record<string, string> = {
    Home: 'Home',
    Vehicles: 'Vehicles',
    Installment: 'Installment',
    Giveaway: 'Giveaway',
    About: 'About',
    Contact: 'Contact',
  };

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm text-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="gtranslate_wrapper"></div>
            
            <div className="flex items-center space-x-3 sm:space-x-5">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button onClick={() => { setCurrentPage('Dashboard'); setTimeout(() => window.dispatchEvent(new CustomEvent('open-dashboard-sidebar')), 120); }} className="font-bold tracking-widest text-base uppercase transition-colors hover:text-byd-red flex items-center">
                MENU
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Fullscreen overlay removed — Navbar MENU now opens the dashboard sidebar for a single consistent menu experience. */}
    </>
  );
};

export default Navbar;