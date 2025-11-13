import React, { useState, useEffect } from 'react';
import { fetchDeposits, updateDeposit, updateUser, getUser } from '../../services/dbService';
import { Deposit } from '../../types';

const DepositsTab: React.FC = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDeposits = async () => {
    setIsLoading(true);
    const fetchedDeposits = await fetchDeposits();
    setDeposits(fetchedDeposits);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDeposits();
  }, []);

  const handleConfirmDeposit = async (deposit: Deposit) => {
    if (!deposit || !window.confirm(`Are you sure you want to confirm a deposit of ¥${deposit.amount.toLocaleString()} for ${deposit.userName}?`)) {
      return;
    }

    try {
      // 1. Get the user's current data to calculate the new balance
      const user = await getUser(deposit.userId);
      if (!user) {
        alert("Error: Could not find the user associated with this deposit.");
        return;
      }

      const newBalance = user.balance + deposit.amount;

      // 2. Update the user's balance in the database
      await updateUser(deposit.userId, { balance: newBalance });

      // 3. Update the deposit status to 'Completed'
      await updateDeposit(deposit.id, { status: 'Completed' });

      // 4. (Optional) Send a confirmation email to the user
      // await sendDepositConfirmation(deposit.userEmail, { ... });

      alert(`Deposit confirmed! ${user.name}'s new balance is ¥${newBalance.toLocaleString()}.`);

      // 5. Refresh the UI
      await loadDeposits();
    } catch (error) {
      alert("An error occurred while confirming the deposit. Please check the console for details.");
      console.error("Error confirming deposit:", error);
    }
  };
  
  const statusClasses = {
    'Completed': 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300',
    'Pending': 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300',
    'Failed': 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300',
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading deposit requests...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">User</th>
            <th scope="col" className="px-6 py-3">Amount</th>
            <th scope="col" className="px-6 py-3">Method</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deposits.map((deposit) => (
            <tr key={deposit.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4">{new Date(deposit.request_date).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <div className="font-medium text-black dark:text-white whitespace-nowrap">{deposit.userName}</div>
                <div className="text-xs">{deposit.userEmail}</div>
              </td>
              <td className="px-6 py-4 font-bold text-black dark:text-white">¥{deposit.amount.toLocaleString()}</td>
              <td className="px-6 py-4">{deposit.method}</td>
              <td className="px-6 py-4">
                <span className={`text-xs px-2 py-1 rounded-full ${statusClasses[deposit.status]}`}>
                  {deposit.status}
                </span>
              </td>
              <td className="px-6 py-4">
                {deposit.status === 'Pending' ? (
                  <button
                    onClick={() => handleConfirmDeposit(deposit)}
                    className="border border-byd-red text-byd-red px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-byd-red/10 transition-colors w-28 text-center"
                  >
                    Confirm Deposit
                  </button>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepositsTab;
