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
  return (
    <div 
      className={`relative w-full h-96 bg-cover bg-center text-white rounded-xl overflow-hidden group cursor-pointer ${isSelectedForCompare ? 'ring-4 ring-byd-red' : ''}`}
      style={{ backgroundImage: `url(${vehicle.imageUrl})` }}
      onClick={() => onSelectForDetail(vehicle)}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full text-center px-6 py-8">
        {/* Vehicle name at top */}
        <h3 className="text-4xl md:text-5xl font-black tracking-wider uppercase drop-shadow-lg">
          {vehicle.name}
        </h3>
        
        {/* Explore button at bottom */}
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