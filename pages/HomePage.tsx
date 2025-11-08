
import React from 'react';
import Hero from '../components/Hero';
import VehicleCard from '../components/VehicleCard';
import { VEHICLES } from '../constants';
import { Page } from '../App';
import { Vehicle } from '../types';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
  onSelectForInstallment: (vehicle: Vehicle) => void;
  onSelectForPurchase: (vehicle: Vehicle) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage, onSelectForInstallment, onSelectForPurchase }) => {
  const featuredVehicles = VEHICLES.slice(0, 3);

  return (
    <div>
      <Hero />
      <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Featured Vehicles</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">Discover our most popular models, combining cutting-edge technology with stunning design.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} onSelectForInstallment={onSelectForInstallment} onSelectForPurchase={onSelectForPurchase} />
            ))}
          </div>
          <div className="text-center mt-12">
            <button 
              onClick={() => setCurrentPage('Vehicles')}
              className="bg-byd-red text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-byd-red-dark transition-colors duration-300"
            >
              Explore All Models
            </button>
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <img src="https://picsum.photos/seed/byd-giveaway-bg/1920/1080" alt="Giveaway Background" className="absolute inset-0 w-full h-full object-cover opacity-10 dark:opacity-20"/>
        <div className="relative container mx-auto px-6 text-center">
          <div className="mb-4 text-5xl">🎉</div>
          <h2 className="text-4xl font-extrabold mb-4">Win a BYD Dolphin!</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Participate in our exclusive giveaway for a chance to own the future of city driving. A $1,000 entry fee is required to secure your spot.
          </p>
          <button
            onClick={() => setCurrentPage('Giveaway')}
            className="bg-byd-red text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-byd-red-dark transition-transform transform hover:scale-105 duration-300 shadow-lg"
          >
            Enter the Giveaway
          </button>
        </div>
      </section>
      
      <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
                <img src="https://picsum.photos/seed/byd-dealership/800/600" alt="BYD Dealership" className="rounded-lg shadow-xl"/>
            </div>
            <div className="md:w-1/2">
                <h2 className="text-4xl font-bold mb-4">Welcome to Wuxi BYD</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
                    At Wuxi BYD Vehicles Co., Ltd, we are committed to providing innovative and sustainable transportation solutions. As an authorized dealer in the heart of Wuxi, we bring you the latest in electric vehicle technology, backed by unparalleled customer service.
                </p>
                <button onClick={() => setCurrentPage('About')} className="text-byd-red font-semibold text-lg hover:underline">
                    Learn More About Us →
                </button>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;