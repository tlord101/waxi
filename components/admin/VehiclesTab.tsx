
import React from 'react';
import { VEHICLES } from '../../constants';

const VehiclesTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-right">
        <button 
          onClick={() => alert('Opening form to add a new vehicle... (Simulated)')}
          className="bg-byd-red text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-byd-red-dark transition-colors"
        >
          + Add New Vehicle
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">Image</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Type</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {VEHICLES.map((vehicle) => (
              <tr key={vehicle.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">
                  <img src={vehicle.imageUrl} alt={vehicle.name} className="w-16 h-12 object-cover rounded"/>
                </td>
                <td className="px-6 py-4 font-medium text-black dark:text-white whitespace-nowrap">{vehicle.name}</td>
                <td className="px-6 py-4">{vehicle.type}</td>
                <td className="px-6 py-4">¥{vehicle.price.toLocaleString()}</td>
                <td className="px-6 py-4 space-x-4">
                  <button 
                    onClick={() => alert(`Editing ${vehicle.name}... (Simulated)`)}
                    className="font-medium text-blue-500 dark:text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => alert(`Deleting ${vehicle.name}... (Simulated)`)}
                    className="font-medium text-red-500 dark:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehiclesTab;