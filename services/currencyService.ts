// Currency service to fetch exchange rates and detect user location
export interface ExchangeRates {
  [currency: string]: number;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
];

// Map of country codes to currency codes
const COUNTRY_TO_CURRENCY: { [key: string]: string } = {
  US: 'USD', CA: 'CAD', GB: 'GBP', AU: 'AUD', NZ: 'NZD',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR', AT: 'EUR',
  PT: 'EUR', IE: 'EUR', FI: 'EUR', GR: 'EUR',
  JP: 'JPY', CN: 'CNY', IN: 'INR', SG: 'SGD', HK: 'HKD',
  CH: 'CHF', AE: 'AED', SA: 'SAR', NG: 'NGN', ZA: 'ZAR',
  BR: 'BRL', MX: 'MXN', AR: 'ARS', CL: 'CLP',
  KR: 'KRW', TH: 'THB', MY: 'MYR', ID: 'IDR', PH: 'PHP',
  RU: 'RUB', TR: 'TRY', PL: 'PLN', SE: 'SEK', NO: 'NOK', DK: 'DKK',
};

/**
 * Detect user's currency based on their location
 * Uses ipapi.co for geolocation
 */
export const detectUserCurrency = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const countryCode = data.country_code;
    
    // Return currency based on country, default to USD
    return COUNTRY_TO_CURRENCY[countryCode] || 'USD';
  } catch (error) {
    console.error('Error detecting user currency:', error);
    return 'USD'; // Default to USD on error
  }
};

/**
 * Fetch exchange rates from exchangerate-api.com (free tier)
 * Base currency is USD
 */
export const fetchExchangeRates = async (): Promise<ExchangeRates> => {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Return default rates (all 1:1) on error
    const defaultRates: ExchangeRates = {};
    SUPPORTED_CURRENCIES.forEach(currency => {
      defaultRates[currency.code] = 1;
    });
    return defaultRates;
  }
};

/**
 * Convert price from USD to target currency
 */
export const convertPrice = (priceUSD: number, targetCurrency: string, rates: ExchangeRates): number => {
  const rate = rates[targetCurrency] || 1;
  return priceUSD * rate;
};

/**
 * Format price with currency symbol
 */
export const formatPrice = (price: number, currencyCode: string): string => {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  const symbol = currency?.symbol || '$';
  
  // Format with proper decimal places
  const decimals = ['JPY', 'KRW'].includes(currencyCode) ? 0 : 2;
  const formattedNumber = price.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  // For currencies like USD, EUR, GBP - symbol before number
  // For currencies like CNY, INR - symbol after number
  if (['CNY', 'INR', 'THB', 'PHP', 'IDR'].includes(currencyCode)) {
    return `${formattedNumber} ${symbol}`;
  }
  
  return `${symbol}${formattedNumber}`;
};
