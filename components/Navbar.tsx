import React, { useState } from 'react';
import { Page, Theme } from '../App';
import { NAV_LINKS } from '../constants';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isLoggedIn: boolean;
  onLogin: (password: string) => boolean;
  onLogout: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage, isLoggedIn, onLogin, onLogout, theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLoginClick = () => {
    const password = prompt("Enter admin password:");
    if (password) {
      const success = onLogin(password);
      if (!success) {
        alert("Incorrect password.");
      }
    }
  };

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
          </div>

          <div className="hidden lg:flex items-center space-x-4">
             <button 
              onClick={() => setCurrentPage('Giveaway')}
              className="bg-yellow-400 text-black py-2 px-4 rounded-full hover:bg-yellow-500 transition-colors duration-300 font-semibold text-sm"
            >
              🎉 Apply for Giveaway
            </button>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                 <button 
                  onClick={() => setCurrentPage('Admin')}
                  className="bg-gray-700 text-white py-2 px-6 rounded-full hover:bg-gray-600 transition-colors duration-300 font-semibold"
                >
                  Admin
                </button>
                <button 
                  onClick={onLogout}
                  className="bg-byd-red text-white py-2 px-6 rounded-full hover:bg-byd-red-dark transition-colors duration-300 font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLoginClick}
                className="bg-byd-red text-white py-2 px-6 rounded-full hover:bg-byd-red-dark transition-colors duration-300 font-semibold"
              >
                Login
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
           <button 
              onClick={() => { setCurrentPage('Giveaway'); setIsOpen(false); }}
              className="w-full bg-yellow-400 text-black mt-4 py-2 px-6 rounded-full hover:bg-yellow-500 transition-colors duration-300 font-semibold"
            >
             🎉 Apply for Giveaway
            </button>
            {isLoggedIn ? (
               <div className="mt-4 space-y-3">
                 <button 
                  onClick={() => { setCurrentPage('Admin'); setIsOpen(false); }}
                  className="w-full bg-gray-700 text-white py-2 px-6 rounded-full hover:bg-gray-600 transition-colors duration-300 font-semibold"
                 >
                   Admin
                 </button>
                 <button 
                  onClick={() => { onLogout(); setIsOpen(false); }}
                  className="w-full bg-byd-red text-white py-2 px-6 rounded-full hover:bg-byd-red-dark transition-colors duration-300 font-semibold"
                 >
                   Logout
                 </button>
               </div>
            ) : (
               <button 
                  onClick={() => { handleLoginClick(); setIsOpen(false); }}
                  className="w-full bg-byd-red text-white mt-4 py-2 px-6 rounded-full hover:bg-byd-red-dark transition-colors duration-300 font-semibold"
                >
                  Login
                </button>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;