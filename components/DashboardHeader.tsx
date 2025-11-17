import React, { useEffect } from 'react';
import { Page } from '../types';

interface Props {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
  title?: string;
}

const DashboardHeader: React.FC<Props> = ({ currentPage, setCurrentPage, onLogout, title }) => {
  useEffect(() => {
    // Inject GTranslate script if not present (same logic as Navbar)
    if (document.getElementById('gtranslate-script')) return;

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

    return () => {
      const gtranslateScript = document.getElementById('gtranslate-script');
      if (gtranslateScript) {
        if (typeof (gtranslateScript as any).remove === 'function') {
          (gtranslateScript as any).remove();
        } else if (gtranslateScript.parentNode) {
          gtranslateScript.parentNode.removeChild(gtranslateScript);
        }
      }
    };
  }, []);

  const handleMenuClick = () => {
    if (currentPage !== 'Dashboard') {
      setCurrentPage('Dashboard');
      setTimeout(() => window.dispatchEvent(new CustomEvent('open-dashboard-sidebar')), 120);
    } else {
      window.dispatchEvent(new CustomEvent('open-dashboard-sidebar'));
    }
  };

  return (
    <header className="w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 z-40">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleMenuClick} aria-label="Open menu" className="bg-byd-red text-white p-3 rounded-full hover:bg-byd-red-dark transition-colors shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="gtranslate_wrapper"></div>
        </div>
        <h1 className="text-2xl font-bold">{title || 'My Dashboard'}</h1>
        <div className="w-24" />
      </div>
    </header>
  );
};

export default DashboardHeader;
