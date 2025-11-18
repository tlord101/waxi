import React, { useState, useEffect, useRef } from 'react';
// FIX: Import Page and Theme from types.ts to break circular dependency.
import { Page, Theme } from '../types';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import CurrencySelector from './CurrencySelector';
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
  // Navbar provides a small dropdown menu on the homepage MENU button.
  // The dropdown is accessible (ESC to close, outside click to close) and
  // shows contextual links including Dashboard when a user is signed in.

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

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setIsOpen(false);
    // If navigating to dashboards, open the sidebar after navigation
    if (page === 'Dashboard' || page === 'Admin') {
      setTimeout(() => window.dispatchEvent(new CustomEvent('open-dashboard-sidebar')), 120);
    }
  };

  const handleAuthNavigate = (action: 'login' | 'signup') => {
    setIsOpen(false);
    if (action === 'login') setCurrentPage('Login');
    if (action === 'signup') setCurrentPage('Signup');
  };

  const DashboardLink = () => {
    if (isAdminLoggedIn) {
      return (
        <button onClick={() => handleNavigate('Admin')} className="w-full text-left px-4 py-2 hover:bg-gray-800">Admin Dashboard</button>
      );
    }
    if (currentUser) {
      return (
        <button onClick={() => handleNavigate('Dashboard')} className="w-full text-left px-4 py-2 hover:bg-gray-800">Dashboard</button>
      );
    }
    return null;
  };

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm text-white">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <button onClick={() => handleNavigate('Home')} className="cursor-pointer flex-shrink-0">
              <Logo theme="dark" />
            </button>

            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-5" ref={wrapperRef}>
              <div className="gtranslate_wrapper"></div>
              <CurrencySelector />
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <div className="relative">
                <button onClick={() => setIsOpen(s => !s)} aria-expanded={isOpen} aria-haspopup="true" className="font-bold tracking-widest text-sm sm:text-base uppercase transition-colors hover:text-byd-red flex items-center whitespace-nowrap">
                  MENU
                </button>
                {isOpen && (
                  <div role="menu" aria-label="Main menu" className="absolute right-0 mt-2 w-56 bg-gray-800 text-white rounded-md shadow-lg ring-1 ring-black/30">
                    <div className="py-2">
                      <button onClick={() => handleNavigate('Home')} className="w-full text-left px-4 py-2 hover:bg-gray-700">Home</button>
                      <button onClick={() => handleNavigate('Vehicles')} className="w-full text-left px-4 py-2 hover:bg-gray-700">Vehicles</button>
                      <button onClick={() => handleNavigate('Contact')} className="w-full text-left px-4 py-2 hover:bg-gray-700">Contact Us</button>
                      <button onClick={() => handleNavigate('About')} className="w-full text-left px-4 py-2 hover:bg-gray-700">About Us</button>
                      <button onClick={() => handleNavigate('Giveaway')} className="w-full text-left px-4 py-2 hover:bg-gray-700">Giveaway</button>
                      <div className="border-t border-gray-700 my-1" />
                      {!currentUser && !isAdminLoggedIn && (
                        <>
                          <button onClick={() => handleAuthNavigate('login')} className="w-full text-left px-4 py-2 hover:bg-gray-700">Login</button>
                          <button onClick={() => handleAuthNavigate('signup')} className="w-full text-left px-4 py-2 hover:bg-gray-700">Signup</button>
                        </>
                      )}
                      <DashboardLink />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;