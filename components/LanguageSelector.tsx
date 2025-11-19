import React, { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'es', name: 'Español' },
  { code: 'zh-CN', name: '中文' },
  { code: 'pt', name: 'Português' },
  { code: 'th', name: 'ไทย' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ar', name: 'العربية' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'hu', name: 'Magyar' },
  { code: 'ms', name: 'Bahasa Melayu' },
];

const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleLanguageChange = (code: string) => {
    // Trigger GTranslate language change
    const select = document.querySelector('.gtranslate_wrapper select') as HTMLSelectElement;
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
      >
        <ion-icon name="globe-outline" style={{ fontSize: '24px', color: 'white' }}></ion-icon>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-800 text-white rounded-md shadow-lg ring-1 ring-black/30 z-50 max-h-96 overflow-y-auto">
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center justify-between transition-colors"
              >
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
