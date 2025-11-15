import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { Language, LANGUAGES } from '../types';
import { translations } from '../lib/translations';
import { translateText as apiTranslateText } from '../services/geminiService';

interface TranslationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  translate: (text: string) => Promise<string>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // FIX: Updated language initialization to auto-detect the user's browser language.
  // It now checks localStorage first, then the browser's language setting, and finally falls back to English.
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      
      // 1. Check for a language explicitly set by the user in localStorage
      const savedLangCode = localStorage.getItem('byd-language');
      if (savedLangCode) {
        // FIX: Use .find() instead of .includes() to provide a type guard for TypeScript.
        // This confirms that the string from localStorage is a valid 'Language' type,
        // resolving the "not assignable" error without needing an unsafe type assertion.
        const lang = LANGUAGES.find(l => l.code === savedLangCode);
        if (lang) {
          return lang.code;
        }
      }
      
      // 2. Detect browser language and use it if supported
      const browserLangCode = navigator.language.split('-')[0]; // e.g., 'en' from 'en-US'
      // FIX: Apply the same .find() type guard for the browser's language code to
      // ensure it's a valid 'Language' type before returning it.
      const lang = LANGUAGES.find(l => l.code === browserLangCode);
      if (lang) {
        return lang.code;
      }
    }
    
    // 3. Fallback to English
    return 'en';
  });

  const translationCache = useMemo(() => new Map<string, string>(), []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('byd-language', lang);
    }
  };

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  const translate = useCallback(async (text: string): Promise<string> => {
    if (language === 'en' || !text) {
      return text;
    }
    const cacheKey = `${language}:${text}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }
    
    try {
      const translatedText = await apiTranslateText(text, language);
      translationCache.set(cacheKey, translatedText);
      return translatedText;
    } catch (error) {
      console.error("Translation failed:", error);
      return text; // Fallback to original text on error
    }
  }, [language, translationCache]);

  const value = {
    language,
    setLanguage,
    t,
    translate,
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