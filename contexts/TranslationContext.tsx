import React, { createContext, useState, useContext, useEffect } from 'react';
import { Language, LANGUAGES } from '../types';

// Helper to get the current language from the Google Translate cookie.
const getLanguageFromCookie = (): Language => {
  if (typeof window !== 'undefined') {
    const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)/);
    if (match && match[2]) {
      const langCode = match[2].split('/')[2];
      // Map Google's specific Chinese code back to our general one.
      if (langCode === 'zh-CN') return 'zh';
      
      // Ensure the cookie value is a valid language code in our app.
      const lang = LANGUAGES.find(l => l.code === langCode);
      if (lang) {
        return lang.code;
      }
    }
  }
  return 'en'; // Default language
};

// Helper to set the language by updating the cookie and reloading the page.
const setLanguageWithCookie = (lang: Language) => {
  if (typeof window !== 'undefined') {
    // Map our general Chinese code to Google's specific one.
    const googleLangCode = lang === 'zh' ? 'zh-CN' : lang;
    document.cookie = `googtrans=/en/${googleLangCode}; path=/; domain=${window.location.hostname}`;
    
    // FIX: Replaced navigation to `pathname` with `origin`.
    // The Google Translate widget can sometimes interfere with the URL's path.
    // Navigating to the origin ensures a clean reload of the application's
    // root page, which is the desired behavior for this single-page app.
    window.location.href = window.location.origin;
  }
};

interface TranslationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  // The `t` and `translate` functions are removed as Google Translate handles the entire page.
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getLanguageFromCookie());
  
  // FIX: Added auto-detection for the user's preferred language on their first visit.
  // This effect checks if the Google Translate cookie is set. If not, it inspects
  // the browser's language (`navigator.language`) and attempts to match it with a supported
  // language. If a match is found (and it's not the default English), it sets the
  // language, which triggers a reload with the translated content.
  useEffect(() => {
    const hasCookie = typeof document !== 'undefined' && document.cookie.includes('googtrans=');
    
    if (!hasCookie && typeof window !== 'undefined' && window.navigator) {
        const userLang = window.navigator.language; // e.g., 'es-ES', 'zh-CN'
        const primaryLang = userLang.split('-')[0] as Language; // e.g., 'es', 'zh'
        
        const supportedLang = LANGUAGES.find(l => l.code === primaryLang);

        if (supportedLang && supportedLang.code !== 'en') {
            console.log(`Auto-detected and setting language to: ${supportedLang.name}`);
            setLanguage(supportedLang.code);
        }
    }
  }, []); // Empty dependency array ensures this runs only once on mount.


  const setLanguage = (lang: Language) => {
    // Prevent unnecessary reloads if the language is already correct.
    if (lang !== language) {
      setLanguageState(lang);
      setLanguageWithCookie(lang);
    }
  };
  
  const value = {
    language,
    setLanguage,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
