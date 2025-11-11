import React, { useState } from 'react';
import { Page, Theme } from '../App';
import { NAV_LINKS } from '../constants';
import Logo from './Logo';
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-black text-black dark:text-white sticky top-0 z-50 shadow-lg dark:shadow-black/20 transition-colors duration-300">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div 
            className="cursor-pointer"
            onClick={() => setCurrentPage('Home')}
          >
            <Logo theme={theme} />
          </div>
          
          <div className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentPage(link.name); }}
                className={`transition-colors duration-300 hover:text-byd-red hover:underline ${currentPage === link.name ? 'text-byd-red font-semibold' : 'text-gray-700 dark:text-gray-200'}`}
              >
                {link.name}
              </a>
            ))}
             {isAdminLoggedIn && (
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentPage('Admin'); }}
                className={`transition-colors duration-300 hover:text-byd-red hover:underline ${currentPage === 'Admin' ? 'text-byd-red font-semibold' : 'text-gray-700 dark:text-gray-200'}`}
              >
                Admin
              </a>
            )}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                 <button 
                  onClick={() => setCurrentPage('Dashboard')}
                  className="bg-gray-700 text-white py-2 px-6 rounded-full hover:bg-gray-600 transition-colors duration-300 font-semibold"
                >
                  Dashboard
                </button>
                <button 
                  onClick={onUserLogout}
                  className="bg-byd-red text-white py-2 px-6 rounded-full hover:bg-byd-red-dark transition-colors duration-300 font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentPage('Login')}
                  className="bg-byd-red text-white py-2 px-6 rounded-full hover:bg-byd-red-dark transition-colors duration-300 font-semibold"
                >
                  Login
                </button>
                 <button 
                  onClick={() => setCurrentPage('Signup')}
                  className="bg-transparent text-byd-red border border-byd-red py-2 px-6 rounded-full hover:bg-byd-red/10 transition-colors duration-300 font-semibold"
                >
                  Sign Up
                </button>
              </div>
            )}
             {isAdminLoggedIn && (
                 <button 
                  onClick={onAdminLogout}
                  className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white py-2 px-4 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 font-semibold text-sm"
                >
                  Admin Logout
                </button>
            )}
             <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>

          <div className="lg:hidden flex items-center gap-4">
             <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button onClick={() => setIsOpen(!isOpen)} className="font-bold tracking-widest text-lg">
              {isOpen ? (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                 </svg>
              ) : (
                'MENU'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'} bg-white/95 dark:bg-black/95 backdrop-blur-sm`}>
        <div className="px-6 pt-2 pb-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href="#"
              onClick={(e) => { e.preventDefault(); setCurrentPage(link.name); setIsOpen(false); }}
              className={`block text-center py-2 rounded transition-colors duration-300 hover:bg-byd-red hover:text-white ${currentPage === link.name ? 'text-byd-red font-bold' : 'text-gray-800 dark:text-gray-200'}`}
            >
              {link.name}
            </a>
          ))}
            {currentUser ? (
               <div className="mt-4 space-y-3">
                 <button 
                  onClick={() => { setCurrentPage('Dashboard'); setIsOpen(false); }}
                  className="w-full bg-gray-700 text-white py-2 px-6 rounded-full hover:bg-gray-600 transition-colors duration-300 font-semibold"
                 >
                   Dashboard
                 </button>
                 <button 
                  onClick={() => { onUserLogout(); setIsOpen(false); }}
                  className="w-full bg-byd-red text-white py-2 px-6 rounded-full hover:bg-byd-red-dark transition-colors duration-300 font-semibold"
                 >
                   Logout
                 </button>
               </div>
            ) : (
               <div className="mt-4 space-y-3">
                 <button 
                    onClick={() => { setCurrentPage('Login'); setIsOpen(false); }}
                    className="w-full bg-byd-red text-white py-2 px-6 rounded-full hover:bg-byd-red-dark transition-colors duration-300 font-semibold"
                  >
                    Login
                  </button>
                   <button 
                    onClick={() => { setCurrentPage('Signup'); setIsOpen(false); }}
                    className="w-full bg-transparent text-byd-red border border-byd-red py-2 px-6 rounded-full hover:bg-byd-red/10 transition-colors duration-300 font-semibold"
                  >
                    Sign Up
                  </button>
               </div>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
