import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

interface TranslatedTextProps {
  children: string;
  className?: string;
}

const TranslatedText: React.FC<TranslatedTextProps> = ({ children, className }) => {
  const { translate, language } = useTranslation();
  const [translatedText, setTranslatedText] = useState(children);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // No need to translate from English to English or if text is empty
    if (language === 'en' || !children) {
      if (translatedText !== children) {
          setTranslatedText(children);
      }
      return;
    }

    let isMounted = true;
    const doTranslate = async () => {
      setIsLoading(true);
      const result = await translate(children);
      if (isMounted) {
        setTranslatedText(result);
        setIsLoading(false);
      }
    };

    doTranslate();

    return () => {
      isMounted = false;
    };
  }, [children, language, translate]);

  if (isLoading) {
    return <span className={`opacity-50 animate-pulse ${className}`}>...</span>;
  }

  return <span className={className}>{translatedText}</span>;
};

export default TranslatedText;
