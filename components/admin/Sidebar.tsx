
import React from 'react';
import { AdminTab } from '../../pages/AdminPage';

interface SidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

const TABS: { name: AdminTab, icon: string }[] = [
  { name: 'Analytics', icon: 'stats-chart-outline' },
  { name: 'Vehicles', icon: 'car-sport-outline' },
  { name: 'Orders', icon: 'cart-outline' },
  { name: 'Installments', icon: 'card-outline' },
  { name: 'Giveaway', icon: 'gift-outline' },
  { name: 'Email Logs', icon: 'mail-outline' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-white dark:bg-black text-gray-600 dark:text-gray-300 flex-col h-screen sticky top-0 border-r border-gray-200 dark:border-gray-800 hidden md:flex">
      <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-byd-red">ADMIN PANEL</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {TABS.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
              activeTab === tab.name
                ? 'bg-byd-red text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'
            }`}
          >
            <ion-icon name={tab.icon} style={{ fontSize: '1.25rem' }}></ion-icon>
            <span className="font-semibold">{tab.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;