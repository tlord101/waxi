import React, { useEffect, useState } from 'react';
import { User, Investment, Page } from '../types';
import DashboardHeader from '../components/DashboardHeader';
import { getInvestmentsForUser, addInvestment, updateUser } from '../services/dbService';

interface Props {
  user: User;
  setCurrentUser: (user: User) => void;
  currentPage: Page;
  setCurrentPage?: (page: Page) => void;
  onLogout: () => void;
}

const InvestmentsPage: React.FC<Props> = ({ user, setCurrentUser, currentPage, setCurrentPage, onLogout }) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentError, setInvestmentError] = useState('');

  const fetchUserInvestments = async () => {
    const userInvestments = await getInvestmentsForUser(user.id);
    setInvestments(userInvestments);
  };

  useEffect(() => {
    fetchUserInvestments();
  }, [user.id]);

  const handleInvestment = async () => {
    const amount = parseFloat(investmentAmount);
    setInvestmentError('');

    if (isNaN(amount) || amount <= 0) {
      setInvestmentError('Please enter a valid amount.');
      return;
    }
    if (amount > user.balance) {
      setInvestmentError('Insufficient balance for this investment.');
      return;
    }

    await addInvestment({
      userId: user.id,
      amount,
      description: `User Investment #${Math.floor(Math.random() * 1000)}`
    });
    const newBalance = user.balance - amount;
    await updateUser(user.id, { balance: newBalance });

    setCurrentUser({ ...user, balance: newBalance });
    await fetchUserInvestments();
    setInvestmentAmount('');
    alert(`Successfully invested ¥${amount.toLocaleString()}`);
  };

  return (
    <div>
      <DashboardHeader currentPage={currentPage} setCurrentPage={setCurrentPage || (() => {})} onLogout={onLogout} title="Investments" />
      <div className="py-16 container mx-auto px-6">
        <h1 className="text-4xl font-extrabold mb-6">Investments</h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-6">Make an Investment</h2>
          <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg">
            {investmentError && <p className="text-red-500 text-sm mb-2">{investmentError}</p>}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                placeholder={`Amount (Balance: ¥${user.balance.toLocaleString()})`}
                value={investmentAmount}
                onChange={e => setInvestmentAmount(e.target.value)}
                className="flex-grow p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-byd-red focus:border-byd-red"
              />
              <button onClick={handleInvestment} className="bg-byd-red text-white py-3 px-8 rounded-md font-semibold hover:bg-byd-red-dark transition-colors">
                Invest Now
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6">Investment History</h2>
          {investments.length > 0 ? (
            <div className="space-y-4">
              {investments.map(inv => (
                <div key={inv.id} className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold text-black dark:text-white">{inv.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(inv.date).toLocaleDateString()}</p>
                  </div>
                  <p className="font-bold text-lg text-green-600 dark:text-green-400">+ ¥{inv.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No active investments found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentsPage;
