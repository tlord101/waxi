

import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'green' | 'blue' | 'purple' | 'yellow';
}

const colorClasses = {
  green: 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400',
  blue: 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  purple: 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
  yellow: 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
};

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClasses[color]}`}>
        {/* FIX: Replaced class with className for ion-icon custom element */}
        <ion-icon name={icon} className="text-3xl"></ion-icon>
      </div>
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-black dark:text-white">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;