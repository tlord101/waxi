import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { LANGUAGES, Language } from '../types';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // FIX: Find the short name for the current language to display in the button.
  // This provides a more user-friendly and native representation (e.g., '中' for Chinese).
  const currentLanguageShort = LANGUAGES.find(l => l.code === language)?.short || language.toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-white/20 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <i className="bi bi-globe text-xl text-white"></i>
        {/* FIX: Use the new 'short' name for a better display. */}
        <span className="font-semibold text-sm text-white">{currentLanguageShort}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-black rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-800 animate-fade-in-up">
          <ul className="p-1">
            {LANGUAGES.map(lang => (
              <li key={lang.code}>
                <button
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    language === lang.code
                      ? 'bg-byd-red text-white'
                      : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {lang.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;