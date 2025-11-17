import React from 'react';
import { User, Page } from '../types';
import DashboardHeader from '../components/DashboardHeader';

interface Props {
  user: User;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
}

const WalletPage: React.FC<Props> = ({ user, currentPage, setCurrentPage, onLogout }) => {
  return (
    <div>
      <DashboardHeader currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={onLogout} title="My Dashboard" />
      <div className="py-16 container mx-auto px-6">
        <h1 className="text-4xl font-extrabold mb-6">Wallet</h1>
        <div className="bg-gradient-to-br from-byd-red to-byd-red-dark text-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center max-w-xl mx-auto">
          <p className="text-lg opacity-80">Current Balance</p>
          <p className="text-4xl font-extrabold tracking-tight my-2">¥{user.balance.toLocaleString()}</p>
          <button onClick={() => setCurrentPage('Deposit')} className="mt-4 bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
            <span className="flex items-center gap-2">
              <ion-icon name="add-circle-outline"></ion-icon>
              <span>Deposit Funds</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
