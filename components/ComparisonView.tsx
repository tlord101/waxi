import React from 'react';
import { Vehicle } from '../types';

interface ComparisonViewProps {
  vehicles: Vehicle[];
  onClose: () => void;
}

// FIX: Define a common interface for spec keys to resolve type errors.
// This ensures the `format` property is optional and can be safely accessed.
interface SpecDefinition {
  key: string;
  name: string;
  format?: (val: number) => string;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ vehicles, onClose }) => {
  // Create a master list of all unique spec names from all vehicles being compared
  const allSpecNames = new Set<string>();
  vehicles.forEach(vehicle => {
    vehicle.specs.forEach(spec => {
      allSpecNames.add(spec.name);
    });
  });

  // Create an array of spec objects for rendering, keeping a consistent order
  const dynamicSpecKeys = Array.from(allSpecNames).sort().map(name => ({ key: name, name: name }));
  
  // Define the master list of specs to compare, with static ones first
  const specKeys: SpecDefinition[] = [
    { key: 'price', name: 'Price', format: (val: number) => `¥${val.toLocaleString()}` },
    { key: 'type', name: 'Type' },
    ...dynamicSpecKeys
  ];

  const getSpecValue = (vehicle: Vehicle, specName: string) => {
    const spec = vehicle.specs.find(s => s.name === specName);
    return spec ? spec.value : '—';
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 grid grid-cols-3 items-center border-b border-gray-200 dark:border-gray-700">
          {/* Go Back Button */}
          <div className="justify-self-start">
            <button onClick={onClose} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-byd-red dark:hover:text-byd-red transition-colors">
              <ion-icon name="arrow-back-outline" style={{ fontSize: '1.5rem' }}></ion-icon>
              <span className="font-semibold hidden sm:block">Back</span>
            </button>
          </div>
          
          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white text-center justify-self-center">
            Compare Vehicles
          </h2>

          {/* Close Button */}
          <div className="justify-self-end">
            <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-byd-red dark:hover:text-byd-red">
              <ion-icon name="close-outline" style={{ fontSize: '2rem' }}></ion-icon>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left">
            {/* Table Header with Vehicle Images and Names */}
            <thead className="sticky top-0 bg-white dark:bg-gray-900 z-10">
              <tr>
                <th className="p-4 w-1/5 text-black dark:text-white">Feature</th>
                {vehicles.map(v => (
                  <th key={v.id} className="p-4 text-center">
                    <img src={v.imageUrl} alt={v.name} className="w-full h-40 object-cover rounded-lg mx-auto" />
                    <p className="font-bold text-lg mt-2 text-black dark:text-white">{v.name}</p>
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Table Body with Specs */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {specKeys.map(spec => (
                <tr key={spec.key} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4 font-semibold text-gray-700 dark:text-gray-300">{spec.name}</td>
                  {vehicles.map(v => (
                    <td key={v.id} className="p-4 text-center text-black dark:text-white">
                      {spec.key === 'price' && spec.format ? spec.format(v.price) : 
                       spec.key === 'type' ? v.type : 
                       getSpecValue(v, spec.name)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;