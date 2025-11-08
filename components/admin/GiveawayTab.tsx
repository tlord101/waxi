import React from 'react';
import { getGiveawayEntries } from '../../services/dbService';

const GiveawayTab: React.FC = () => {
  const giveawayEntries = getGiveawayEntries();
  
  const handleMarkWinner = (id: number) => {
    // In a real app, you would update the state and database here.
    alert(`Marked entry #${id} as winner! (Simulated)`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Country</th>
            <th scope="col" className="px-6 py-3">Raffle Code</th>
            <th scope="col" className="px-6 py-3">Winner</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {giveawayEntries.map((entry) => (
            <tr key={entry.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4 font-medium text-black dark:text-white whitespace-nowrap">{entry.name}</td>
              <td className="px-6 py-4">{entry.email}</td>
              <td className="px-6 py-4">{entry.country}</td>
              <td className="px-6 py-4 font-mono text-black dark:text-white">{entry.raffle_code}</td>
              <td className="px-6 py-4">
                 <span className={`text-xs px-2 py-1 rounded-full ${
                    entry.winner_status === 'Yes' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300' : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                  }`}>
                    {entry.winner_status}
                </span>
              </td>
              <td className="px-6 py-4">
                {entry.winner_status === 'No' && (
                  <button 
                    onClick={() => handleMarkWinner(entry.id)}
                    className="font-medium text-byd-red hover:underline"
                  >
                    Mark as Winner
                  </button>
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
