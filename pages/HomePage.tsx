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
      
      {/* --- About Us Section (Right Below Hero) --- */}
      {homepageContent && homepageContent.about_image_url && (
        <section className="relative py-24 bg-white dark:bg-black overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-byd-red/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
          
          <div className="relative container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Image Column */}
              <div className="relative group order-2 lg:order-1">
                <div className="absolute -inset-2 bg-gradient-to-r from-byd-red via-orange-500 to-red-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                <img 
                  src={homepageContent.about_image_url} 
                  alt="About BYD" 
                  className="relative w-full h-96 lg:h-full rounded-2xl object-cover shadow-2xl"
                />
              </div>
              
              {/* Content Column */}
              <div className="order-1 lg:order-2">
                {/* Pre-heading */}
                <div className="inline-block mb-4">
                  <span className="inline-block px-4 py-2 bg-byd-red/10 text-byd-red font-semibold text-sm uppercase tracking-widest rounded-full">
                    About Our Company
                  </span>
                </div>
                
                {/* Main Heading */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black dark:text-white mb-6 leading-tight">
                  {homepageContent.about_title || 'Welcome to Zhengzhou BYD'}
                </h2>
                
                {/* Divider */}
                <div className="h-1 w-20 bg-gradient-to-r from-byd-red to-orange-500 rounded-full mb-8"></div>
                
                {/* Description Text */}
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-light">
                  {homepageContent.about_text || 'At Zhengzhou BYD Vehicles Co., Ltd, we are committed to providing innovative and sustainable transportation solutions. As an authorized dealer in the heart of Zhengzhou, we bring you the latest in electric vehicle technology, backed by unparalleled customer service.'}
                </p>
                
                {/* Features List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-byd-red/10 text-byd-red">
                        <ion-icon name="flash-outline" class="text-2xl"></ion-icon>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-black dark:text-white mb-1">Innovation</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Cutting-edge EV technology</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-byd-red/10 text-byd-red">
                        <ion-icon name="shield-checkmark-outline" class="text-2xl"></ion-icon>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-black dark:text-white mb-1">Reliability</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Trusted by millions worldwide</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-byd-red/10 text-byd-red">
                        <ion-icon name="leaf-outline" class="text-2xl"></ion-icon>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-black dark:text-white mb-1">Sustainable</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Zero-emission solutions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-byd-red/10 text-byd-red">
                        <ion-icon name="star-outline" class="text-2xl"></ion-icon>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-black dark:text-white mb-1">Excellence</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Premium customer service</p>
                    </div>
                  </div>
                </div>
                
                {/* CTA Button */}
                <button 
                  onClick={() => setCurrentPage('About')}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-byd-red to-red-600 hover:from-byd-red-dark hover:to-red-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {homepageContent.about_button_link_text || 'Learn More About Us'}
                  <ion-icon name="arrow-forward-outline" class="text-xl"></ion-icon>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      
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