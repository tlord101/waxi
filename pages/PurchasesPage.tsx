import React from 'react';
import { User } from '../types';

interface Props {
  user: User;
  setCurrentPage: (page: string) => void;
}

const PurchasesPage: React.FC<Props> = ({ user }) => {
  return (
    <div className="py-16 container mx-auto px-6">
      <h1 className="text-4xl font-extrabold mb-6">Purchases</h1>
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold mb-6">Pending Purchases</h2>
        <div className="text-center py-12 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">You have no pending purchases.</p>
        </div>
      </div>
    </div>
  );
};

export default PurchasesPage;
