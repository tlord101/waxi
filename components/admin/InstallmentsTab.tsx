import React from 'react';
import { getInstallmentPlans } from '../../services/dbService';

const InstallmentsTab: React.FC = () => {
  const installmentPlans = getInstallmentPlans();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">Customer</th>
            <th scope="col" className="px-6 py-3">Vehicle</th>
            <th scope="col" className="px-6 py-3">Total Price</th>
            <th scope="col" className="px-6 py-3">Monthly Payment</th>
            <th scope="col" className="px-6 py-3">Term</th>
            <th scope="col" className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {installmentPlans.map((plan) => (
            <tr key={plan.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4 font-medium text-black dark:text-white whitespace-nowrap">{plan.customer_name}</td>
              <td className="px-6 py-4">{plan.vehicle_name}</td>
              <td className="px-6 py-4">¥{plan.total_price.toLocaleString()}</td>
              <td className="px-6 py-4 font-semibold text-byd-red">¥{plan.monthly_payment.toLocaleString()}</td>
              <td className="px-6 py-4">{plan.term_months} mos</td>
              <td className="px-6 py-4">
                 <span className={`text-xs px-2 py-1 rounded-full ${
                    plan.status === 'Active' ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300'
                  }`}>
                    {plan.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstallmentsTab;
