
import React from 'react';
import DashboardCard from './DashboardCard';
import BarChart from './BarChart';
import { getOrders, getInstallmentPlans, getGiveawayEntries, getSalesOverTime } from '../../services/dbService';

const AnalyticsTab: React.FC = () => {
  const orders = getOrders();
  const installmentPlans = getInstallmentPlans();
  const giveawayEntries = getGiveawayEntries();
  const salesOverTime = getSalesOverTime();

  const totalRevenue = orders.reduce((acc, order) => acc + order.total_price, 0);
  const totalOrders = orders.length;
  const activeInstallments = installmentPlans.filter(p => p.status === 'Active').length;
  const giveawayParticipants = giveawayEntries.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Revenue"
          value={`¥${(totalRevenue / 1000000).toFixed(2)} M`}
          icon="cash-outline"
          color="green"
        />
        <DashboardCard
          title="Total Orders"
          value={totalOrders.toString()}
          icon="cart-outline"
          color="blue"
        />
        <DashboardCard
          title="Active Installments"
          value={activeInstallments.toString()}
          icon="wallet-outline"
          color="purple"
        />
        <DashboardCard
          title="Giveaway Participants"
          value={giveawayParticipants.toString()}
          icon="gift-outline"
          color="yellow"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Sales Over Time</h3>
          <BarChart data={salesOverTime} />
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Recent Orders</h3>
          <div className="space-y-4">
            {orders.slice(0, 4).map(order => (
              <div key={order.id} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{order.customer_name}</p>
                  <p className="text-gray-500 dark:text-gray-400">{order.vehicle_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">¥{order.total_price.toLocaleString()}</p>
                   {/* FIX: Property 'status' does not exist on type 'Order'. Use 'fulfillment_status' instead. */}
                   <span className={`text-xs px-2 py-1 rounded-full ${
                    order.fulfillment_status === 'Delivered' ? 'bg-green-100 dark:bg-green-200/20 text-green-800 dark:text-green-300' :
                    order.fulfillment_status === 'Processing' ? 'bg-yellow-100 dark:bg-yellow-200/20 text-yellow-800 dark:text-yellow-300' :
                    'bg-red-100 dark:bg-red-200/20 text-red-800 dark:text-red-300'
                  }`}>{order.fulfillment_status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;