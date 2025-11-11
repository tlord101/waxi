

import React from 'react';
import { AdminTab } from '../../pages/AdminPage';

interface SidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const TABS: { name: AdminTab, icon: string }[] = [
  { name: 'Analytics', icon: 'stats-chart-outline' },
  { name: 'Vehicles', icon: 'car-sport-outline' },
  { name: 'Orders', icon: 'cart-outline' },
  { name: 'Installments', icon: 'card-outline' },
  { name: 'Giveaway', icon: 'gift-outline' },
  { name: 'Email Logs', icon: 'mail-outline' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const handleTabClick = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsOpen(false); // Close menu on selection
  };

  return (
    <>
      {/* Overlay for mobile view */}
      <div 
        className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-black text-gray-600 dark:text-gray-300 flex flex-col border-r border-gray-200 dark:border-gray-800 z-40 transition-transform duration-300 ease-in-out md:sticky md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-byd-red">ADMIN PANEL</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {TABS.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab.name)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                activeTab === tab.name
                  ? 'bg-byd-red text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'
              }`}
            >
              {/* FIX: Replaced class with className for ion-icon custom element */}
              <ion-icon name={tab.icon} className="text-xl"></ion-icon>
              <span className="font-semibold">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
