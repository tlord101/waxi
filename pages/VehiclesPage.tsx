import React, { useState } from 'react';
import VehicleCard from '../components/VehicleCard';
// FIX: Import Page from types.ts to break circular dependency.
import { Page, Vehicle } from '../types';
import CompareBar from '../components/CompareBar';
import ComparisonView from '../components/ComparisonView';

type VehicleType = 'All' | 'Sedan' | 'SUV' | 'Hatchback' | 'Commercial' | 'Special';

interface VehiclesPageProps {
  vehicles: Vehicle[];
  setCurrentPage: (page: Page) => void;
  onSelectForInstallment: (vehicle: Vehicle) => void;
  onSelectForPurchase: (vehicle: Vehicle) => void;
  onSelectForDetail: (vehicle: Vehicle) => void;
}

const VehiclesPage: React.FC<VehiclesPageProps> = ({ vehicles, setCurrentPage, onSelectForInstallment, onSelectForPurchase, onSelectForDetail }) => {
  const [filter, setFilter] = useState<VehicleType>('All');
  
  // State for comparison feature
  const [compareList, setCompareList] = useState<Vehicle[]>([]);
  const [showCompareView, setShowCompareView] = useState(false);

  const handleToggleCompare = (vehicle: Vehicle) => {
    setCompareList(prev => {
      const isSelected = prev.some(v => v.id === vehicle.id);
      if (isSelected) {
        return prev.filter(v => v.id !== vehicle.id);
      } else {
        if (prev.length < 4) {
          return [...prev, vehicle];
        }
        // Optional: show a message if limit is reached
        alert("You can compare a maximum of 4 vehicles.");
        return prev;
      }
    });
  };

  const handleRemoveFromCompare = (vehicleId: string) => {
    setCompareList(prev => prev.filter(v => v.id !== vehicleId));
  };
  
  const handleClearCompare = () => {
    setCompareList([]);
  };

  const filteredVehicles = filter === 'All' ? vehicles : vehicles.filter(v => v.type === filter);
  
  const vehicleTypes: VehicleType[] = ['All', 'Sedan', 'SUV', 'Hatchback', 'Commercial', 'Special'];

  return (
    <div className="py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-extrabold text-center mb-4">Our Vehicle Lineup</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          From sleek sedans to versatile SUVs and commercial solutions, explore the full range of BYD's innovative electric vehicles. Find the perfect model that fits your lifestyle.
        </p>

        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-2 bg-gray-100 dark:bg-gray-900 p-2 rounded-full">
            {vehicleTypes.map(type => (
               <button 
                key={type}
                onClick={() => setFilter(type)}
                className={`py-2 px-5 rounded-full text-sm md:text-base font-semibold transition-colors duration-300 ${filter === type ? 'bg-byd-red text-white shadow-md' : 'text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}`}
               >
                 {type}
               </button>
            ))}
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-8 max-w-3xl mx-auto ${compareList.length > 0 ? 'pb-28' : ''}`}>
          {filteredVehicles.map((vehicle) => (
            <VehicleCard 
              key={vehicle.id} 
              vehicle={vehicle} 
              onSelectForInstallment={onSelectForInstallment} 
              onSelectForPurchase={onSelectForPurchase}
              onSelectForDetail={onSelectForDetail}
              onToggleCompare={handleToggleCompare}
              isSelectedForCompare={compareList.some(v => v.id === vehicle.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Comparison Components */}
      {compareList.length > 0 && (
        <CompareBar 
          selectedVehicles={compareList}
          onCompare={() => setShowCompareView(true)}
          onClear={handleClearCompare}
          onRemove={handleRemoveFromCompare}
        />
      )}

      {showCompareView && (
        <ComparisonView 
          vehicles={compareList}
          onClose={() => setShowCompareView(false)}
        />
      )}
    </div>
  );
};

export default VehiclesPage;