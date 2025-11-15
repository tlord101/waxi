import React, { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import AnalyticsTab from '../components/admin/AnalyticsTab';
import VehiclesTab from '../components/admin/VehiclesTab';
import OrdersTab from '../components/admin/OrdersTab';
import InstallmentsTab from '../components/admin/InstallmentsTab';
import GiveawayTab from '../components/admin/GiveawayTab';
import EmailLogsTab from '../components/admin/EmailLogsTab';
import DepositsTab from '../components/admin/DepositsTab';
import ContentTab from '../components/admin/ContentTab';
import PaymentSettingsTab from '../components/admin/PaymentSettingsTab';
import { Page } from '../types';

export type AdminTab = 'Analytics' | 'Vehicles' | 'Orders' | 'Deposits' | 'Installments' | 'Giveaway' | 'Email Logs' | 'Content' | 'Payment Settings';

interface AdminPageProps {
  onLogout: () => void;
  setCurrentPage: (page: Page) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onLogout, setCurrentPage }) => {
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
      case 'Content':
        return <ContentTab />;
      case 'Payment Settings':
        return <PaymentSettingsTab />;
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
        onLogout={onLogout}
        setCurrentPage={setCurrentPage}
      />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          {/* Mobile Header elements, now inside main */}
          <div className="md:hidden flex items-center gap-4 mb-6">
              <button 
                  onClick={() => setIsMenuOpen(true)} 
                  className="text-2xl text-black dark:text-white"
                  aria-label="Open menu"
              >
                  <ion-icon name="menu-outline" className="text-2xl"></ion-icon>
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{activeTab}</h1>
          </div>
          
          {/* Desktop Header */}
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