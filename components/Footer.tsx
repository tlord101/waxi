import React from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';

const Footer: React.FC = () => {
  const { content, isLoading } = useSiteContent();
  
  if (isLoading || !content?.footer) {
    // Render a skeleton or null while loading
    return (
      <footer className="bg-[#1a1a1a] text-gray-400">
        <div className="container mx-auto px-6 py-6 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto md:mx-0 md:w-1/4 mb-4 md:mb-0"></div>
            <div className="text-center text-xs text-gray-500 mt-6 pt-6 border-t border-gray-700">
                <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
        </div>
      </footer>
    );
  }

  const { footer } = content;

  return (
    <footer className="bg-[#1a1a1a] text-gray-400">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          {/* Left Side: Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 md:mb-0">
            <a href="#" className="hover:text-white transition-colors">{footer.privacy_link_text}</a>
            <a href="#" className="hover:text-white transition-colors">{footer.cookie_link_text}</a>
            <a href="#" className="hover:text-white transition-colors">{footer.contact_link_text}</a>
          </div>

          {/* Right Side: Socials */}
          <div className="flex items-center gap-6">
            <span className="font-semibold text-gray-300">{footer.follow_us_text}</span>
            <div className="flex items-center gap-5 text-xl">
              <a href={footer.facebook_url} aria-label="Facebook" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <ion-icon name="logo-facebook"></ion-icon>
              </a>
              <a href={footer.twitter_url} aria-label="X / Twitter" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <ion-icon name="logo-twitter"></ion-icon>
              </a>
              <a href={footer.instagram_url} aria-label="Instagram" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <ion-icon name="logo-instagram"></ion-icon>
              </a>
              <a href={footer.tiktok_url} aria-label="TikTok" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <ion-icon name="logo-tiktok"></ion-icon>
              </a>
              <a href={footer.youtube_url} aria-label="YouTube" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <ion-icon name="logo-youtube"></ion-icon>
              </a>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-6 pt-6 border-t border-gray-700">
          {footer.copyright_text}
        </div>
      </div>
    </footer>
  );
};

export default Footer;