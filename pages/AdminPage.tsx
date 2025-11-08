
import React, { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import AnalyticsTab from '../components/admin/AnalyticsTab';
import VehiclesTab from '../components/admin/VehiclesTab';
import OrdersTab from '../components/admin/OrdersTab';
import InstallmentsTab from '../components/admin/InstallmentsTab';
import GiveawayTab from '../components/admin/GiveawayTab';
import EmailLogsTab from '../components/admin/EmailLogsTab';

export type AdminTab = 'Analytics' | 'Vehicles' | 'Orders' | 'Installments' | 'Giveaway' | 'Email Logs';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('Analytics');

  const renderContent = () => {
    switch (activeTab) {
      case 'Analytics':
        return <AnalyticsTab />;
      case 'Vehicles':
        return <VehiclesTab />;
      case 'Orders':
        return <OrdersTab />;
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-4 sm:p-6 lg:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">{activeTab}</h1>
        <div className="w-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;