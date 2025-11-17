import React from 'react';
import { User, Page } from '../types';
import DashboardHeader from '../components/DashboardHeader';

interface Props {
  user: User;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
}

const PurchasesPage: React.FC<Props> = ({ user, currentPage, setCurrentPage, onLogout }) => {
  return (
    <div>
      <DashboardHeader currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={onLogout} title="Purchases" />
      <div className="py-16 container mx-auto px-6">
        <h1 className="text-4xl font-extrabold mb-6">Purchases</h1>
        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold mb-6">Pending Purchases</h2>
          <div className="text-center py-12 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">You have no pending purchases.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasesPage;
