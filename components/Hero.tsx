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
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-6xl md:text-8xl font-black tracking-widest uppercase drop-shadow-lg mb-12">
          {vehicle.name}
        </h1>
        <button
          onClick={onExplore}
          className="px-12 py-3 font-semibold text-white tracking-wider transition-colors duration-300 bg-transparent border border-white/80 hover:bg-white/10"
        >
          {t('hero_explore_more')}
        </button>
      </div>
    </div>
  );
};

export default Hero;