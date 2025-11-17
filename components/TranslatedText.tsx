import React from 'react';

interface TranslatedTextProps {
  children: string;
  className?: string;
}

const TranslatedText: React.FC<TranslatedTextProps> = ({ children, className }) => {
  // FIX: Removed the translation logic that was causing the error.
  // The `translate` function was removed from `useTranslation` because the app now
  // uses a global Google Translate widget for the entire page. This component
  // now simply renders its children.
  return <span className={className}>{children}</span>;
};

export default TranslatedText;
