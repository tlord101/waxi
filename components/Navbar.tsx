import React, { useState } from 'react';
// FIX: Import Page and Theme from types.ts to break circular dependency.
import { Page, Theme } from '../types';
import { NAV_LINKS } from '../constants';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../contexts/TranslationContext';
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
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setIsOpen(false);
  };

  const handleUserLogoutAndClose = () => {
    onUserLogout();
    setIsOpen(false);
  }
  
  const handleAdminLogoutAndClose = () => {
    onAdminLogout();
    setIsOpen(false);
  }

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm text-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div 
              className="cursor-pointer"
              onClick={() => handleNavigate('Home')}
            >
              <Logo theme="dark" />
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-5">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <LanguageSwitcher />
              <button onClick={() => setIsOpen(!isOpen)} className="font-bold tracking-widest text-base uppercase transition-colors hover:text-byd-red flex items-center">
                {isOpen ? (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                ) : (
                  t('nav_menu')
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Fullscreen Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-sm transition-all duration-500 ease-in-out flex flex-col items-center justify-center ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="text-center text-white animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="space-y-6">
            {NAV_LINKS.map((link) => (
              <a key={link.name} href="#"
                onClick={(e) => { e.preventDefault(); handleNavigate(link.name); }}
                className={`block text-3xl font-semibold transition-colors duration-300 hover:text-byd-red ${currentPage === link.name ? 'text-byd-red' : 'text-white'}`}
              >
                {t(`nav_${link.name.toLowerCase()}`)}
              </a>
            ))}
             {isAdminLoggedIn && (
              <a href="#"
                onClick={(e) => { e.preventDefault(); handleNavigate('Admin'); }}
                className={`block text-3xl font-semibold transition-colors duration-300 hover:text-byd-red ${currentPage === 'Admin' ? 'text-byd-red' : 'text-white'}`}
              >
                {t('nav_admin')}
              </a>
            )}
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 w-full max-w-xs mx-auto">
            {currentUser ? (
               <div className="space-y-4">
                 <button onClick={() => handleNavigate('Dashboard')} className="w-full bg-gray-700 text-white py-3 px-8 rounded-full hover:bg-gray-600 transition-colors duration-300 font-semibold text-lg">
                   {t('nav_dashboard')}
                 </button>
                 <button onClick={handleUserLogoutAndClose} className="w-full bg-byd-red text-white py-3 px-8 rounded-full hover:bg-byd-red-dark transition-colors duration-300 font-semibold text-lg">
                   {t('nav_logout')}
                 </button>
               </div>
            ) : (
               <div className="space-y-4">
                 <button onClick={() => handleNavigate('Login')} className="w-full bg-byd-red text-white py-3 px-8 rounded-full hover:bg-byd-red-dark transition-colors duration-300 font-semibold text-lg">
                    {t('nav_login')}
                  </button>
                   <button onClick={() => handleNavigate('Signup')} className="w-full bg-transparent text-white border border-white py-3 px-8 rounded-full hover:bg-white/10 transition-colors duration-300 font-semibold text-lg">
                    {t('nav_signup')}
                  </button>
               </div>
            )}
             {isAdminLoggedIn && (
                 <button onClick={handleAdminLogoutAndClose} className="mt-4 bg-gray-200 dark:bg-gray-700 text-black dark:text-white py-2 px-4 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 font-semibold text-sm">
                  Admin Logout
                </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;