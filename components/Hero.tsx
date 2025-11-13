import React from 'react';
import { Page } from '../types';

interface HeroProps {
  setCurrentPage: (page: Page) => void;
}

const Hero: React.FC<HeroProps> = ({ setCurrentPage }) => {
  return (
    <div 
      className="relative w-full h-[90vh] bg-cover bg-center text-white" 
      style={{ backgroundImage: "url('https://picsum.photos/seed/bydtang-hero/1920/1080')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 flex flex-col items-center justify-between h-full p-4 py-24 text-center">
        <h1 className="text-5xl tracking-widest text-white uppercase md:text-8xl font-extrabold drop-shadow-lg animate-fade-in-down">BYD TANG</h1>
        <button
          onClick={() => setCurrentPage('Vehicles')}
          className="px-10 py-3 mt-4 font-semibold text-white uppercase transition-colors duration-300 bg-transparent border-2 border-white rounded-sm hover:bg-white hover:text-black animate-fade-in-up"
        >
          Explore More
        </button>
      </div>
    </div>
  );
};

export default Hero;