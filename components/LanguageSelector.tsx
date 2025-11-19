import React, { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', short: 'EN' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', short: 'FR' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', short: 'IT' },
  { code: 'es', name: 'Español', flag: '🇪🇸', short: 'ES' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳', short: 'ZH' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', short: 'PT' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭', short: 'TH' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', short: 'HI' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', short: 'AR' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', short: 'ID' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺', short: 'HU' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾', short: 'MS' },
];

const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]); // Default to English
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLanguageChange = (lang: typeof languages[0]) => {
    // Trigger GTranslate language change
    const select = document.querySelector('.gtranslate_wrapper select') as HTMLSelectElement;
    if (select) {
      select.value = lang.code;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    setSelectedLang(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
      >
        <span className="text-lg">{selectedLang.flag}</span>
        <span className="font-semibold text-white text-sm">{selectedLang.short}</span>
        <ion-icon name={isOpen ? "chevron-up-outline" : "chevron-down-outline"} style={{ fontSize: '16px', color: 'white' }}></ion-icon>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-800 text-white rounded-md shadow-lg ring-1 ring-black/30 z-50 max-h-96 overflow-y-auto">
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang)}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-3 transition-colors"
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
                <span className="ml-auto text-gray-400 text-xs">{lang.short}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
