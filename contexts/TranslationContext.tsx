import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { Language } from '../types';
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
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('byd-language');
      if (savedLang && (savedLang === 'en' || savedLang === 'zh' || savedLang === 'es')) {
        return savedLang as Language;
      }
    }
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
