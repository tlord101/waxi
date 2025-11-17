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
import LiveChatTab from '../components/admin/LiveChatTab';
import { Page } from '../types';

export type AdminTab = 'Analytics' | 'Vehicles' | 'Orders' | 'Deposits' | 'Installments' | 'Giveaway' | 'Live Chat' | 'Email Logs' | 'Content' | 'Payment Settings';

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
      case 'Live Chat':
        return <LiveChatTab />;
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
        <div className="sticky top-4 z-50 bg-white/70 dark:bg-black/60 backdrop-blur-sm p-3 rounded-md mb-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentPage('Home')} className="text-lg p-2 rounded-full bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm hover:opacity-90 transition-colors" aria-label="Back">
                <ion-icon name="arrow-back-outline" className="text-xl"></ion-icon>
              </button>
              <button 
                  onClick={() => setIsMenuOpen(true)} 
                  className="text-2xl p-2 rounded-full bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm hover:opacity-90 transition-colors"
                  aria-label="Open menu"
              >
                  <ion-icon name="menu-outline" className="text-2xl"></ion-icon>
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-2">{activeTab}</h1>
            </div>
            <div>
              <button onClick={onLogout} className="bg-white dark:bg-gray-900 text-black dark:text-white py-2 px-4 rounded-full hover:opacity-90 transition-colors duration-200 font-semibold text-sm shadow-sm">Logout</button>
            </div>
          </div>
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <div className="w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;