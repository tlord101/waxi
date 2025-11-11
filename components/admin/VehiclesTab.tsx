import React, { useState, useEffect } from 'react';
import { Vehicle } from '../../types';
import { fetchVehicles, addVehicle, updateVehicle, deleteVehicle } from '../../services/dbService';
import VehicleForm from './VehicleForm';

const VehiclesTab: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshVehicles = async () => {
    setIsLoading(true);
    const fetchedVehicles = await fetchVehicles();
    setVehicles(fetchedVehicles);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshVehicles();
  }, []);

  const handleEditClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setView('edit');
  };

  const handleDeleteClick = async (vehicleId: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      await deleteVehicle(vehicleId);
      await refreshVehicles();
    }
  };

  const handleFormSubmit = async (vehicleData: Omit<Vehicle, 'id'> | Vehicle) => {
    if ('id' in vehicleData) {
      // Editing existing vehicle
      await updateVehicle(vehicleData);
    } else {
      // Adding new vehicle
      await addVehicle(vehicleData);
    }
    await refreshVehicles();
    setView('list');
    setSelectedVehicle(null);
  };

  const handleCancel = () => {
    setView('list');
    setSelectedVehicle(null);
  };
  
  if (view === 'add' || view === 'edit') {
    return (
        <VehicleForm 
            initialVehicle={view === 'edit' ? selectedVehicle : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
        />
    );
  }

  if (isLoading) {
    return <div className="text-center p-8">Loading vehicles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-right">
        <button 
          onClick={() => setView('add')}
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
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">
                  <img src={vehicle.imageUrl} alt={vehicle.name} className="w-16 h-12 object-cover rounded"/>
                </td>
                <td className="px-6 py-4 font-medium text-black dark:text-white whitespace-nowrap">{vehicle.name}</td>
                <td className="px-6 py-4">{vehicle.type}</td>
                <td className="px-6 py-4">¥{vehicle.price.toLocaleString()}</td>
                <td className="px-6 py-4 space-x-4">
                  <button 
                    onClick={() => handleEditClick(vehicle)}
                    className="font-medium text-blue-500 dark:text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(vehicle.id)}
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