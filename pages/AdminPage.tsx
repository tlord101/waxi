import React, { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import AnalyticsTab from '../components/admin/AnalyticsTab';
import VehiclesTab from '../components/admin/VehiclesTab';
import OrdersTab from '../components/admin/OrdersTab';
import InstallmentsTab from '../components/admin/InstallmentsTab';
import GiveawayTab from '../components/admin/GiveawayTab';
import EmailLogsTab from '../components/admin/EmailLogsTab';
import DepositsTab from '../components/admin/DepositsTab';

export type AdminTab = 'Analytics' | 'Vehicles' | 'Orders' | 'Deposits' | 'Installments' | 'Giveaway' | 'Email Logs';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('Analytics');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'Analytics':
        return <AnalyticsTab />;
      case 'Vehicles':
        return <VehiclesTab />;
      case 'Orders':
        return <OrdersTab />;
      case 'Deposits':
        return <DepositsTab />;
      case 'Installments':
        return <InstallmentsTab />;
      case 'Giveaway':
        return <GiveawayTab />;
      case 'Email Logs':
        return <EmailLogsTab />;
      default:
        return <AnalyticsTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
      />
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-20 p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="text-2xl text-black dark:text-white"
            aria-label="Open menu"
          >
            {/* FIX: Corrected ion-icon usage to ensure proper rendering and type compatibility. */}
            <ion-icon name="menu-outline" className="text-2xl"></ion-icon>
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{activeTab}</h1>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <h1 className="hidden md:block text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">{activeTab}</h1>
          <div className="w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;