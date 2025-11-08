
import React from 'react';
import { Vehicle } from '../types';

interface CompareBarProps {
  selectedVehicles: Vehicle[];
  onCompare: () => void;
  onClear: () => void;
  onRemove: (vehicleId: number) => void;
}

const CompareBar: React.FC<CompareBarProps> = ({ selectedVehicles, onCompare, onClear, onRemove }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-byd-red shadow-[0_-5px_15px_rgba(0,0,0,0.2)] z-40 animate-fade-in-up">
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <h3 className="text-lg font-bold text-black dark:text-white hidden md:block">Compare Vehicles:</h3>
          {selectedVehicles.map(v => (
            <div key={v.id} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
              <img src={v.imageUrl} alt={v.name} className="w-10 h-10 object-cover rounded"/>
              <span className="text-sm font-semibold text-black dark:text-white">{v.name}</span>
              <button onClick={() => onRemove(v.id)} className="text-gray-500 hover:text-red-500">
                <ion-icon name="close-circle-outline"></ion-icon>
              </button>
            </div>
          ))}
           {selectedVehicles.length === 0 && <p className="text-gray-500">Select up to 4 vehicles to compare.</p>}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onClear} 
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white py-2 px-4 rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 text-sm">
            Clear All
          </button>
          <button 
            onClick={onCompare} 
            disabled={selectedVehicles.length < 2}
            className="bg-byd-red text-white py-2 px-6 rounded-full font-semibold hover:bg-byd-red-dark transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
            Compare ({selectedVehicles.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;