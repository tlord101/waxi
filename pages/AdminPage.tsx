import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/admin/Sidebar';
import DashboardLayout from '../components/DashboardLayout';
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
import AiPageBuilder from '../components/admin/AiPageBuilder';
import MenuEditor from '../components/admin/MenuEditor';
import { Page } from '../types';

export type AdminTab = 'Analytics' | 'Vehicles' | 'Orders' | 'Deposits' | 'Installments' | 'Giveaway' | 'Live Chat' | 'Email Logs' | 'Content' | 'Payment Settings' | 'AI Builder' | 'Menu Editor';

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
      case 'AI Builder':
        return <AiPageBuilder />;
      case 'Menu Editor':
        return <MenuEditor />;
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
    <DashboardLayout
      currentPage="Admin"
      setCurrentPage={setCurrentPage}
      onLogout={onLogout}
      sidebarContent={({ isOpen, setIsOpen }) => (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onLogout={onLogout}
          setCurrentPage={setCurrentPage}
        />
      )}
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <div className="w-full">
          {renderContent()}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default AdminPage;