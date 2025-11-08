import React from 'react';

interface LogoProps {
  theme?: 'dark' | 'light';
  className?: string;
  wuxiSize?: string;
  logoHeight?: string;
}

// This string represents the "uploaded" BYD logo image file.
// The SVG paths have been replaced with a <text> element to ensure "BYD" is displayed correctly and legibly.
const bydLogoSvgString = '<svg viewBox="0 0 130 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="65" cy="30" rx="63" ry="28" stroke="#d9001b" stroke-width="4" fill="none" /><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="Poppins, sans-serif" font-size="32" font-weight="700" fill="#d9001b" letter-spacing="2">BYD</text></svg>';
const bydLogoDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(bydLogoSvgString)}`;


const Logo: React.FC<LogoProps> = ({ 
  theme = 'dark',
  className = '',
  wuxiSize = 'text-xl',
  logoHeight = 'h-8'
}) => {
  const wuxiTextColor = theme === 'dark' ? 'text-white' : 'text-black';
  
  const hoverGlowClass = theme === 'dark' 
    ? 'hover:drop-shadow-[0_0_20px_#ff2a2a]' 
    : 'hover:drop-shadow-[0_0_10px_#d9001b]';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={bydLogoDataUri}
        alt="BYD Logo"
        className={`${logoHeight} w-auto transition-all duration-300 ease-in-out drop-shadow-[0_0_5px_rgba(217,0,27,0.7)] ${hoverGlowClass}`}
      />

      <span className={`${wuxiSize} font-semibold ${wuxiTextColor} tracking-wider transition-colors duration-300`}>
        Wuxi
      </span>
    </div>
  );
};

export default Logo;