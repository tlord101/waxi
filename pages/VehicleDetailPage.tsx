import React from 'react';
import { Vehicle, Page } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';

interface VehicleDetailPageProps {
  vehicle: Vehicle | null;
  setCurrentPage: (page: Page) => void;
  onSelectForPurchase: (vehicle: Vehicle) => void;
  onSelectForInstallment: (vehicle: Vehicle) => void;
}

const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({
  vehicle,
  setCurrentPage,
  onSelectForPurchase,
  onSelectForInstallment,
}) => {
  const { formatPrice } = useCurrency();

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold">Vehicle not found</h1>
          <button
            onClick={() => setCurrentPage('Vehicles')}
            className="mt-4 text-byd-red hover:underline"
          >
            Return to Vehicle List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center md:bg-fixed flex flex-col items-center px-4 py-10"
      style={{ backgroundImage: `url(${vehicle.imageUrl})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Back Button */}
      <button
        onClick={() => setCurrentPage('Vehicles')}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20 flex items-center gap-2 text-white 
                   bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-black/50 transition-colors"
      >
        <ion-icon name="arrow-back-outline"></ion-icon>
        <span>All Vehicles</span>
      </button>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-5xl flex flex-col gap-10 text-white">

        {/* Vehicle Info + Actions */}
        <section className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight mb-3">
            {vehicle.name}
          </h1>

          <p className="text-lg text-gray-200 mb-6">
            {vehicle.description}
          </p>

          <div className="mb-8">
            <span className="text-gray-300 text-lg">Starting from</span>
            <p className="text-4xl md:text-5xl font-bold">{formatPrice(vehicle.price)}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onSelectForPurchase(vehicle)}
              className="w-full bg-byd-red text-white py-3 px-6 rounded-full font-semibold 
                         hover:bg-byd-red-dark transition-colors text-lg"
            >
              Buy Now
            </button>

            <button
              onClick={() => onSelectForInstallment(vehicle)}
              className="w-full bg-white/20 border border-white/50 text-white py-3 px-6 rounded-full 
                         font-semibold hover:bg-white/30 transition-colors text-lg"
            >
              Pay in Installments
            </button>
          </div>
        </section>

        {/* Specifications Section */}
        <section className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/20 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold border-b-2 border-byd-red pb-2">
            Key Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {vehicle.specs.map((spec) => (
              <div key={spec.name} className="flex items-center gap-4">
                <ion-icon name={spec.icon} className="text-byd-red text-4xl"></ion-icon>
                <div>
                  <p className="text-gray-300">{spec.name}</p>
                  <p className="text-xl font-bold">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* INTERIOR SECTION — Full Width */}
      {vehicle.interiors && vehicle.interiors.length > 0 && (
        <section className="relative z-10 w-screen mt-12 px-6 py-10 bg-white/5 backdrop-blur-md border-t border-white/10 text-white">
          <div className="max-w-6xl mx-auto">

            <h3 className="text-2xl sm:text-3xl font-bold mb-6">
              Explore More — Interiors
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {vehicle.interiors.map((it, idx) => (
                <figure
                  key={idx}
                  className="rounded-xl overflow-hidden shadow-lg relative group"
                >
                  <img
                    src={it.imageUrl}
                    alt={it.title || `Interior ${idx + 1}`}
                    className="w-full h-32 sm:h-40 md:h-48 object-cover"
                  />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                    <h4 className="text-lg font-semibold text-white">{it.title}</h4>
                    <p className="text-sm text-gray-200 mt-1">{it.description}</p>
                  </figcaption>
                </figure>
              ))}
            </div>

          </div>
        </section>
      )}

    </div>
  );
};

export default VehicleDetailPage;
