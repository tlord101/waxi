import React from 'react';
import { Vehicle, Page } from '../types';

interface VehicleDetailPageProps {
  vehicle: Vehicle | null;
  setCurrentPage: (page: Page) => void;
  onSelectForPurchase: (vehicle: Vehicle) => void;
  onSelectForInstallment: (vehicle: Vehicle) => void;
}

const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({ vehicle, setCurrentPage, onSelectForPurchase, onSelectForInstallment }) => {
  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold">Vehicle not found</h1>
          <button onClick={() => setCurrentPage('Vehicles')} className="mt-4 text-byd-red hover:underline">
            Return to Vehicle List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-fixed flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${vehicle.imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Back Button */}
      <button 
        onClick={() => setCurrentPage('Vehicles')} 
        className="absolute top-8 left-6 z-20 flex items-center gap-2 text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-black/50 transition-colors"
      >
        <ion-icon name="arrow-back-outline"></ion-icon>
        <span>All Vehicles</span>
      </button>

      <main className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-fade-in-up text-white">
        {/* Left Side: Info & Actions */}
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-2">{vehicle.name}</h1>
          <p className="text-lg text-gray-200 mb-6">{vehicle.description}</p>
          
          <div className="mb-8">
            <span className="text-gray-300 text-lg">Starting from</span>
            <p className="text-5xl font-bold">¥{vehicle.price.toLocaleString()}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onSelectForPurchase(vehicle)}
              className="w-full bg-byd-red text-white py-3 px-6 rounded-full font-semibold hover:bg-byd-red-dark transition-colors duration-300 text-lg"
            >
              Buy Now
            </button>
            <button 
              onClick={() => onSelectForInstallment(vehicle)}
              className="w-full bg-white/20 border border-white/50 text-white py-3 px-6 rounded-full font-semibold hover:bg-white/30 transition-colors duration-300 text-lg"
            >
              Pay in Installments
            </button>
          </div>
        </div>

        {/* Right Side: Specs */}
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/20 space-y-6">
          <h2 className="text-3xl font-bold border-b-2 border-byd-red pb-2">Key Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {vehicle.specs.map(spec => (
              <div key={spec.name} className="flex items-center gap-4">
                <ion-icon name={spec.icon} className="text-byd-red text-4xl"></ion-icon>
                <div>
                  <p className="text-gray-300">{spec.name}</p>
                  <p className="text-xl font-bold">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VehicleDetailPage;
