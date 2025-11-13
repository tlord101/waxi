import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-400">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          {/* Left Side: Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 md:mb-0">
            <a href="#" className="hover:text-white transition-colors">Privacy & Legal</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          {/* Right Side: Socials */}
          <div className="flex items-center gap-6">
            <span className="font-semibold text-gray-300">FOLLOW US</span>
            <div className="flex items-center gap-5 text-xl">
              <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
                <ion-icon name="logo-facebook"></ion-icon>
              </a>
              <a href="#" aria-label="X / Twitter" className="hover:text-white transition-colors">
                <ion-icon name="logo-twitter"></ion-icon>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
                <ion-icon name="logo-instagram"></ion-icon>
              </a>
              <a href="#" aria-label="TikTok" className="hover:text-white transition-colors">
                <ion-icon name="logo-tiktok"></ion-icon>
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-white transition-colors">
                <ion-icon name="logo-youtube"></ion-icon>
              </a>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-6 pt-6 border-t border-gray-700">
          ©{new Date().getFullYear()} Wuxi BYD Vehicle Co., Ltd. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;