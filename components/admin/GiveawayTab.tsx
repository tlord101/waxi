import React, { useState, useEffect } from 'react';
import { fetchGiveawayEntries, updateGiveawayEntry } from '../../services/dbService';
import { sendGiveawayConfirmation } from '../../services/emailService';
import { GiveawayEntry } from '../../types';

const GiveawayTab: React.FC = () => {
  const [giveawayEntries, setGiveawayEntries] = useState<GiveawayEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEntries = async () => {
    setIsLoading(true);
    const entries = await fetchGiveawayEntries();
    // Sort by status to bring actionable items to the top
    const sortedEntries = entries.sort((a, b) => {
        const order = { 'Verifying': 1, 'Awaiting Receipt': 2, 'Pending': 3, 'Paid': 4};
        return (order[a.payment_status] || 99) - (order[b.payment_status] || 99);
    });
    setGiveawayEntries(sortedEntries);
    setIsLoading(false);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleVerifyPayment = async (entry: GiveawayEntry) => {
    if (!window.confirm(`Are you sure you want to verify payment for ${entry.name}?`)) return;

    try {
      await updateGiveawayEntry(entry.id, { payment_status: 'Paid' });
      await sendGiveawayConfirmation(entry.email, { name: entry.name, raffleCode: entry.raffle_code });
      alert(`Payment verified for ${entry.name}. They have received their confirmation and raffle code.`);
      await loadEntries(); // Refresh list
    } catch (error) {
      console.error("Failed to verify giveaway payment:", error);
      alert("An error occurred during verification.");
    }
  };
  
  const handleMarkWinner = (id: string) => {
    // In a real app, you would update the state and database here.
    alert(`Marked entry #${id} as winner! (Simulated)`);
  };

  const paymentStatusClasses = {
    'Paid': 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300',
    'Verifying': 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300',
    'Awaiting Receipt': 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300',
    'Pending': 'bg-gray-100 dark:bg-gray-600/20 text-gray-800 dark:text-gray-300',
  };
  
  if (isLoading) {
    return <div className="text-center p-8">Loading giveaway entries...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Raffle Code</th>
            <th scope="col" className="px-6 py-3">Payment Status</th>
            <th scope="col" className="px-6 py-3">Winner</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {giveawayEntries.map((entry) => (
            <tr key={entry.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4 font-medium text-black dark:text-white whitespace-nowrap">{entry.name}</td>
              <td className="px-6 py-4">{entry.email}</td>
              <td className="px-6 py-4 font-mono text-black dark:text-white">{entry.payment_status === 'Paid' ? entry.raffle_code : 'N/A'}</td>
              <td className="px-6 py-4">
                <span className={`text-xs px-2 py-1 rounded-full ${paymentStatusClasses[entry.payment_status]}`}>
                  {entry.payment_status}
                </span>
              </td>
              <td className="px-6 py-4">
                 <span className={`text-xs px-2 py-1 rounded-full ${
                    entry.winner_status === 'Yes' ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                  }`}>
                    {entry.winner_status}
                </span>
              </td>
              <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                {entry.payment_status === 'Verifying' && (
                  <button onClick={() => handleVerifyPayment(entry)} className="font-medium text-byd-red hover:underline">Verify</button>
                )}
                {entry.payment_status === 'Paid' && entry.winner_status === 'No' && (
                  <button 
                    onClick={() => handleMarkWinner(entry.id)}
                    className="font-medium text-green-500 hover:underline"
                  >
                    Mark Winner
                  </button>
                )}
                 {entry.payment_status === 'Verifying' && entry.receipt_url && (
                    <a href={entry.receipt_url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline">View Receipt</a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GiveawayTab;