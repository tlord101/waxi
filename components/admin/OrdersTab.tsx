
import React, { useState } from 'react';
import { getOrders, updateOrder } from '../../services/dbService';
import { sendOrderConfirmation } from '../../services/emailService';
import { Order } from '../../types';

const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(getOrders());
  
  const handleVerifyPayment = async (order: Order) => {
    if (!order || !window.confirm(`Are you sure you want to verify payment for order ${order.id}?`)) {
        return;
    }

    // 1. Update DB (simulated)
    updateOrder(order.id, { payment_status: 'Paid', fulfillment_status: 'Processing' });

    // 2. Send final confirmation email to customer
    await sendOrderConfirmation(order.customer_email, {
        name: order.customer_name,
        vehicleName: order.vehicle_name,
        price: order.total_price,
    });
    
    alert(`Payment for order ${order.id} has been verified. The customer has been notified.`);

    // 3. Refresh UI
    setOrders(getOrders());
  };

  const paymentStatusClasses = {
    'Paid': 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300',
    'Verifying': 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300',
    'Awaiting Receipt': 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300',
    'Pending': 'bg-gray-100 dark:bg-gray-600/20 text-gray-800 dark:text-gray-300',
    'Failed': 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300',
  };

  const fulfillmentStatusClasses = {
    'Processing': 'bg-yellow-100 dark:bg-yellow-200/20 text-yellow-800 dark:text-yellow-300',
    'Delivered': 'bg-green-100 dark:bg-green-200/20 text-green-800 dark:text-green-300',
    'Cancelled': 'bg-red-100 dark:bg-red-200/20 text-red-800 dark:text-red-300',
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">Order ID</th>
            <th scope="col" className="px-6 py-3">Customer</th>
            <th scope="col" className="px-6 py-3">Vehicle</th>
            <th scope="col" className="px-6 py-3">Price</th>
            <th scope="col" className="px-6 py-3">Payment Status</th>
            <th scope="col" className="px-6 py-3">Fulfillment Status</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4 font-mono text-black dark:text-white">{order.id}</td>
              <td className="px-6 py-4">
                <div className="font-medium text-black dark:text-white whitespace-nowrap">{order.customer_name}</div>
                <div className="text-xs">{order.customer_email}</div>
              </td>
              <td className="px-6 py-4">{order.vehicle_name}</td>
              <td className="px-6 py-4">¥{order.total_price.toLocaleString()}</td>
              <td className="px-6 py-4">
                <span className={`text-xs px-2 py-1 rounded-full ${paymentStatusClasses[order.payment_status]}`}>
                    {order.payment_status}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`text-xs px-2 py-1 rounded-full ${fulfillmentStatusClasses[order.fulfillment_status]}`}>
                    {order.fulfillment_status}
                </span>
              </td>
              <td className="px-6 py-4">
                {order.payment_status === 'Verifying' ? (
                  <button 
                    onClick={() => handleVerifyPayment(order)}
                    className="font-medium text-byd-red hover:underline"
                  >
                    Verify Payment
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

export default OrdersTab;
