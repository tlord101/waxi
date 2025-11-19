import React from 'react';
import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelectForInstallment: (vehicle: Vehicle) => void;
  onSelectForPurchase: (vehicle: Vehicle) => void;
  onSelectForDetail: (vehicle: Vehicle) => void;
  onToggleCompare?: (vehicle: Vehicle) => void;
  isSelectedForCompare?: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelectForInstallment, onSelectForPurchase, onSelectForDetail, onToggleCompare, isSelectedForCompare = false }) => {
  // Get key specs to display (max 3-4 specs)
  const displaySpecs = vehicle.specs.slice(0, 4);

  return (
    <div 
      className={`relative w-full h-screen bg-cover bg-center text-white overflow-hidden group cursor-pointer ${isSelectedForCompare ? 'ring-4 ring-byd-red' : ''}`}
      style={{ backgroundImage: `url(${vehicle.imageUrl})` }}
      onClick={() => onSelectForDetail(vehicle)}
    >
      {/* Light overlay for better spec visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 group-hover:from-black/40 group-hover:to-black/50 transition-colors duration-300"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-6 py-12 md:px-12 md:py-16">
        {/* Specs at top */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-auto">
          {displaySpecs.map((spec, index) => (
            <div key={spec.name} className="text-left">
              <div className="text-3xl md:text-4xl font-bold mb-1">{spec.value}</div>
              <div className="text-xs md:text-sm text-white/80 font-light">{spec.name}</div>
            </div>
          ))}
        </div>
        
        {/* Vehicle name and button at bottom */}
        <div className="mt-auto text-center">
          <h3 className="text-4xl md:text-6xl font-black tracking-wider uppercase drop-shadow-lg mb-8">
            {vehicle.name}
          </h3>
          
          {/* Explore button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectForDetail(vehicle);
            }}
            className="px-10 py-3 font-semibold text-white tracking-wider transition-all duration-300 bg-transparent border-2 border-white/80 hover:bg-white/10 hover:border-white hover:scale-105"
          >
            Explore
          </button>
        </div>
      </div>
      
      {/* Compare button - positioned absolutely */}
      {onToggleCompare && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(vehicle);
          }}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full transition-all duration-300 ${
            isSelectedForCompare 
              ? 'bg-byd-red text-white' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <ion-icon name={isSelectedForCompare ? "checkmark-circle" : "add-circle-outline"} style={{ fontSize: '24px' }}></ion-icon>
        </button>
      )}
    </div>
  );
};

export default VehicleCard;