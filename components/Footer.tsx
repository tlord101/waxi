
import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Logo logoHeight="h-10" wuxiSize="text-2xl" theme="dark" />
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-center sm:text-left">
          {/* Products Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Products</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-byd-red hover:underline transition-colors">Bus</a></li>
              <li><a href="#" className="hover:text-byd-red hover:underline transition-colors">Truck</a></li>
              <li><a href="#" className="hover:text-byd-red hover:underline transition-colors">Forklift</a></li>
              <li><a href="#" className="hover:text-byd-red hover:underline transition-colors">SkyRail</a></li>
              <li><a href="#" className="hover:text-byd-red hover:underline transition-colors">Energy Storage</a></li>
              <li><a href="#" className="hover:text-byd-red hover:underline transition-colors">Auto</a></li>
            </ul>
          </div>

          {/* About BYD Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">About BYD</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-byd-red hover:underline transition-colors">Company Info</a></li>
              <li><a href="#" className="hover:text-byd-red hover:underline transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-byd-red hover:underline transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="mailto:info@bydvehicles.com" className="hover:text-byd-red hover:underline transition-colors">info@bydvehicles.com</a></li>
              <li><a href="tel:+86-173-6171-1305" className="hover:text-byd-red hover:underline transition-colors">+86-173-6171-1305</a></li>
            </ul>
          </div>

          {/* Address Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Address</h3>
            <p className="text-gray-300">No. 985, Fengxiang Road, Liangxi District, Wuxi, China</p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-center">
          <p className="text-sm text-gray-400 mb-4 sm:mb-0">
            ©2025 Wuxi BYD Vehicle Co., Ltd. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            {/* FIX: Replaced class with className for ion-icon custom element */}
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-byd-red transition-colors">
              <ion-icon name="logo-linkedin" className="text-2xl"></ion-icon>
            </a>
            {/* FIX: Replaced class with className for ion-icon custom element */}
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-byd-red transition-colors">
              <ion-icon name="logo-instagram" className="text-2xl"></ion-icon>
            </a>
            {/* FIX: Replaced class with className for ion-icon custom element */}
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-byd-red transition-colors">
              <ion-icon name="logo-facebook" className="text-2xl"></ion-icon>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
