import React, { useEffect, useState } from 'react';
import DashboardHeader from './DashboardHeader';
import { Page } from '../types';

type DashboardTab = 'Wallet' | 'Investments' | 'Purchases' | 'Deposit Funds';

interface SidebarRenderOptions {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  setCurrentPage: (page: Page) => void;
}

interface Props {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
  activeTab?: DashboardTab;
  setActiveTab?: (tab: DashboardTab) => void;
  sidebarContent?: (opts: SidebarRenderOptions) => React.ReactNode;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ currentPage, setCurrentPage, onLogout, activeTab: activeTabProp, setActiveTab: setActiveTabProp, sidebarContent, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalActiveTab, setInternalActiveTab] = useState<DashboardTab>('Wallet');

  const activeTab = activeTabProp ?? internalActiveTab;
  const setActiveTab = setActiveTabProp ?? setInternalActiveTab;

  useEffect(() => {
    const openHandler = () => setIsOpen(true);
    window.addEventListener('open-dashboard-sidebar', openHandler as EventListener);
    return () => window.removeEventListener('open-dashboard-sidebar', openHandler as EventListener);
  }, []);

  const tabs: { name: DashboardTab; icon: string }[] = [
    { name: 'Wallet', icon: 'wallet-outline' },
    { name: 'Investments', icon: 'analytics-outline' },
    { name: 'Purchases', icon: 'receipt-outline' },
    { name: 'Deposit Funds', icon: 'add-circle-outline' },
  ];

  const handleTabClick = (tab: DashboardTab) => {
    if (tab === 'Wallet') setCurrentPage('Wallet');
    else if (tab === 'Investments') setCurrentPage('Investments');
    else if (tab === 'Purchases') setCurrentPage('Purchases');
    else if (tab === 'Deposit Funds') setCurrentPage('Deposit');

    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <div className="bg-white dark:bg-black">
      <DashboardHeader currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={onLogout} />

      <div className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar (default or custom) */}
            <>
              <div
                className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />

              <aside
                className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 z-40 transform transition-transform duration-300 ease-in-out md:static md:w-64 md:h-auto md:transform-none md:z-auto md:flex-shrink-0 md:rounded-lg md:border ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
              >
                <div className="p-4 flex justify-between items-center md:hidden border-b border-gray-200 dark:border-gray-800">
                  <h2 className="font-bold text-lg text-black dark:text-white">Menu</h2>
                  <button onClick={() => setIsOpen(false)} className="text-2xl text-gray-500 dark:text-gray-400 hover:text-byd-red transition-colors">
                    <ion-icon name="close-outline"></ion-icon>
                  </button>
                </div>
                <div className="p-4">
                  {sidebarContent ? (
                    sidebarContent({ isOpen, setIsOpen, activeTab, setActiveTab, setCurrentPage })
                  ) : (
                    <nav className="flex flex-col space-y-1">
                      {tabs.map(tab => (
                        <button
                          key={tab.name}
                          onClick={() => handleTabClick(tab.name)}
                          className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors duration-200 ${activeTab === tab.name ? 'bg-byd-red text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white'}`}
                        >
                          <ion-icon name={tab.icon} className="text-xl"></ion-icon>
                          <span className="font-semibold">{tab.name}</span>
                        </button>
                      ))}
                    </nav>
                  )}
                </div>
              </aside>
            </>

            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
