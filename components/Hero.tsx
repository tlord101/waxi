import React from 'react';
import { Vehicle } from '../types';
import { useTranslation } from '../contexts/TranslationContext';

interface HeroProps {
  vehicle: Vehicle;
  onExplore: () => void;
}

const Hero: React.FC<HeroProps> = ({ vehicle, onExplore }) => {
  const { t } = useTranslation();
  return (
    <div 
      className="relative w-full h-screen bg-cover bg-center text-white" 
      style={{ backgroundImage: `url(${vehicle.imageUrl.replace('/800/600', '/1920/1080')})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-wider uppercase drop-shadow-lg animate-fade-in-down">
          {vehicle.name}
        </h1>
        <button
          onClick={onExplore}
          className="px-10 py-3 mt-8 font-semibold text-white uppercase transition-all duration-300 bg-transparent border-2 border-white rounded-md hover:bg-white hover:text-black hover:scale-105 animate-fade-in-up"
        >
          {t('hero_explore_more')}
        </button>
      </div>
    </div>
  );
};

export default Hero;