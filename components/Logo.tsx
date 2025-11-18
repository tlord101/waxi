import React from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';

interface LogoProps {
  theme?: 'dark' | 'light';
  className?: string;
  wuxiSize?: string;
  logoHeight?: string;
}

// FIX: Replaced the original BYD text logo with a custom SVG that matches the design from the user's screenshot,
// featuring a red arc and line combination for a more sophisticated and custom brand identity.
const bydLogoSvgString = `<svg height="20" viewBox="0 0 34 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 11.0001C5.66667 4.33345 16.3333 -0.333218 22.5 4.00011" stroke="#D9001B" stroke-width="3" stroke-linecap="round"/><path d="M10.5 15.5C14.1667 13.5 20.1667 13.5 23.8333 15.5" stroke="#D9001B" stroke-width="3" stroke-linecap="round"/></svg>`;
const bydLogoDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(bydLogoSvgString)}`;


const Logo: React.FC<LogoProps> = ({ 
  theme = 'dark',
  className = '',
  wuxiSize = 'text-base sm:text-xl',
  logoHeight = 'h-5 sm:h-6' // Adjusted height for new logo - smaller on mobile
}) => {
  const { content } = useSiteContent();
  const wuxiTextColor = theme === 'dark' ? 'text-white' : 'text-black';
  
  const hoverGlowClass = theme === 'dark' 
    ? 'hover:drop-shadow-[0_0_20px_#ff2a2a]' 
    : 'hover:drop-shadow-[0_0_10px_#d9001b]';

  // Use uploaded logo if available, otherwise use default
  const logoUrl = content?.logo_url || bydLogoDataUri;

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <img 
        src={logoUrl}
        alt="Zhengzhou Logo"
        className={`${logoHeight} w-auto transition-all duration-300 ease-in-out ${hoverGlowClass}`}
      />

      <span className={`${wuxiSize} font-semibold ${wuxiTextColor} tracking-wider transition-colors duration-300`}>
        Zhengzhou
      </span>
    </div>
  );
};

export default Logo;

