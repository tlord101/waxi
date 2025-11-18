import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { 
  ExchangeRates, 
  detectUserCurrency, 
  fetchExchangeRates, 
  convertPrice as convertPriceUtil,
  formatPrice as formatPriceUtil 
} from '../services/currencyService';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  rates: ExchangeRates;
  convertPrice: (priceUSD: number) => number;
  formatPrice: (priceUSD: number) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<string>('USD');
  const [rates, setRates] = useState<ExchangeRates>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeCurrency = async () => {
      setIsLoading(true);
      try {
        // Check if user has a saved currency preference
        const savedCurrency = localStorage.getItem('preferred_currency');
        
        // Fetch exchange rates
        const exchangeRates = await fetchExchangeRates();
        setRates(exchangeRates);
        
        if (savedCurrency) {
          // Use saved preference
          setCurrency(savedCurrency);
        } else {
          // Detect user's currency based on location
          const detectedCurrency = await detectUserCurrency();
          setCurrency(detectedCurrency);
          localStorage.setItem('preferred_currency', detectedCurrency);
        }
      } catch (error) {
        console.error('Error initializing currency:', error);
        setCurrency('USD');
      } finally {
        setIsLoading(false);
      }
    };

    initializeCurrency();
  }, []);

  // Update localStorage when currency changes
  useEffect(() => {
    if (currency) {
      localStorage.setItem('preferred_currency', currency);
    }
  }, [currency]);

  const convertPrice = (priceUSD: number): number => {
    return convertPriceUtil(priceUSD, currency, rates);
  };

  const formatPrice = (priceUSD: number): string => {
    const convertedPrice = convertPrice(priceUSD);
    return formatPriceUtil(convertedPrice, currency);
  };

  const value = useMemo(() => ({
    currency,
    setCurrency,
    rates,
    convertPrice,
    formatPrice,
    isLoading,
  }), [currency, rates, isLoading]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
