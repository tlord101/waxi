import React, { useState } from 'react';
import Hero from '../components/Hero';
// FIX: Import Page from types.ts to break circular dependency.
import { Page, Vehicle, User } from '../types';
import VehicleCard from '../components/VehicleCard';
import { useSiteContent } from '../contexts/SiteContentContext';
import CompareBar from '../components/CompareBar';
import ComparisonView from '../components/ComparisonView';

interface HomePageProps {
  vehicles: Vehicle[];
  setCurrentPage: (page: Page) => void;
  onSelectForInstallment: (vehicle: Vehicle) => void;
  onSelectForPurchase: (vehicle: Vehicle) => void;
  onSelectForDetail: (vehicle: Vehicle) => void;
  onVisitDashboard?: () => void;
  currentUser?: User | null;
  isAdminLoggedIn?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ vehicles, setCurrentPage, onSelectForInstallment, onSelectForPurchase, onSelectForDetail, onVisitDashboard, currentUser, isAdminLoggedIn }) => {
  const { content } = useSiteContent();
  const homepageContent = content?.homepage;

  // State from VehiclesPage
  const [compareList, setCompareList] = useState<Vehicle[]>([]);
  const [showCompareView, setShowCompareView] = useState(false);

  // Handlers from VehiclesPage
  const handleToggleCompare = (vehicle: Vehicle) => {
    setCompareList(prev => {
      const isSelected = prev.some(v => v.id === vehicle.id);
      if (isSelected) {
        return prev.filter(v => v.id !== vehicle.id);
      } else {
        if (prev.length < 4) {
          return [...prev, vehicle];
        }
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

  // Find a specific vehicle for the hero, or fall back to the first one.
  const heroVehicle = vehicles.find(v => v.name === 'BYD HAN EV') || vehicles[0];

  return (
    <div>
      {heroVehicle && <Hero vehicle={heroVehicle} onExplore={() => onSelectForDetail(heroVehicle)} onVisitDashboard={onVisitDashboard} currentUser={currentUser} isAdminLoggedIn={isAdminLoggedIn} />}
      
      {/* --- Main Vehicle Listing Section (Merged from VehiclesPage) --- */}
      <section id="vehicle-lineup" className="bg-white dark:bg-black">
        <div className="container mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-4">Our Vehicle Lineup</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            From sleek sedans to versatile SUVs and commercial solutions, explore the full range of BYD's innovative electric vehicles. Find the perfect model that fits your lifestyle.
          </p>
        </div>

          {/* Vehicle Grid - now shows all filtered vehicles */}
          <div className={`flex flex-col ${compareList.length > 0 ? 'pb-28' : ''}`}>
            {vehicles.map((vehicle) => (
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
      </section>

      {/* --- Rest of HomePage content (Giveaway, About) --- */}
      {homepageContent && (
        <>
            <section className="relative py-20 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
                <img src={homepageContent.giveaway_bg_image_url} alt="Giveaway Background" className="absolute inset-0 w-full h-full object-cover opacity-10 dark:opacity-20"/>
                <div className="relative container mx-auto px-6 text-center">
                <div className="mb-4 text-5xl text-byd-red"><i className="bi bi-gift-fill"></i></div>
                <h2 className="text-4xl font-extrabold mb-4">{homepageContent.giveaway_title}</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                    {homepageContent.giveaway_description}
                </p>
                <button
                    onClick={() => setCurrentPage('Giveaway')}
                    className="bg-byd-red text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-byd-red-dark transition-transform transform hover:scale-105 duration-300 shadow-lg"
                >
                    {homepageContent.giveaway_button_text}
                </button>
                </div>
            </section>
            
            <section className="py-20 bg-white dark:bg-black">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <img src={homepageContent.about_image_url} alt="BYD Dealership" className="rounded-lg shadow-xl"/>
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-4xl font-bold mb-4">{homepageContent.about_title}</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
                           {homepageContent.about_text}
                        </p>
                        <button onClick={() => setCurrentPage('About')} className="text-byd-red font-semibold text-lg hover:underline">
                            {homepageContent.about_button_link_text}
                        </button>
                    </div>
                </div>
            </section>
        </>
      )}

      {/* --- Comparison Components (from VehiclesPage) --- */}
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

export default HomePage;