import React from 'react';
import { Vehicle, User } from '../types';
import { useSiteContent } from '../contexts/SiteContentContext';

interface HeroProps {
  vehicle?: Vehicle;
  onExplore?: () => void;
  currentUser?: User | null;
  isAdminLoggedIn?: boolean;
  onVisitDashboard?: () => void;
}

const Hero: React.FC<HeroProps> = ({ vehicle: _vehicle, onExplore: _onExplore, currentUser, isAdminLoggedIn, onVisitDashboard }) => {
  const siteContent = useSiteContent();
  const heroImageUrl = siteContent?.content?.homepage?.hero_image_url || 'https://pngimg.com/d/audi_PNG1736.png';

  const handleViewSpecsClick = () => {
    const lineupSection = document.getElementById('vehicle-lineup');
    if (lineupSection) {
      lineupSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleVisitDashboard = () => {
    if (onVisitDashboard) {
      onVisitDashboard();
      return;
    }
    // Fallback: mirror navbar behavior
    if (isAdminLoggedIn) {
      window.dispatchEvent(new CustomEvent('open-dashboard-sidebar'));
      window.location.href = '/Admin';
      return;
    }
    if (currentUser) {
      window.dispatchEvent(new CustomEvent('open-dashboard-sidebar'));
      window.location.href = '/Dashboard';
      return;
    }
    window.location.href = '/Login';
  };

  return (
    <div className="relative bg-black text-white overflow-hidden">
      <style>{`
        body { background-color: #0a0a0a; color: white; overflow-x: hidden; }
        
        .writing-vertical { writing-mode: vertical-rl; transform: rotate(180deg); }
        
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        
        /* Red Gradient Text */
        .text-gradient { 
          background: linear-gradient(to right, #DC2626, #ffffff); 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .fill-mode-forwards { animation-fill-mode: forwards; }
      `}</style>

      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Abstract Red Line */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-40" viewBox="0 0 1440 900" fill="none">
          <path d="M-200 900 C 200 900, 500 600, 800 600 S 1300 200, 1800 100" stroke="#DC2626" strokeWidth="4"/>
        </svg>
        {/* Red Glow behind the car */}
        <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-red-600 rounded-full mix-blend-screen filter blur-[200px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex items-center justify-center relative z-10 w-full max-w-[95%] mx-auto px-4 lg:px-8 min-h-screen pt-[50px] md:pt-0 bg-black text-white">
        
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2 md:gap-12">

          {/* LEFT SIDE: TEXT (Width 45%) */}
          <div className="w-full md:w-[45%] space-y-6 animate-fade-in relative z-20 text-left md:pl-4 pt-10 md:pt-0">
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold leading-[1] font-serif text-white tracking-tight">
              <span className="text-gradient block mb-1">BUILD YOUR</span>
              DREAMS.
            </h1>
            
            <div className="relative pl-6 border-l-4 border-red-600 delay-100 animate-fade-in opacity-0 fill-mode-forwards">
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Leading the future of clean mobility, Zhengzhou BYD Autos gives you direct access to factory-priced electric vehicles. Discover our latest lineup and find the perfect BYD built for you.
              </p>
              <p className="text-sm text-red-600 mt-2 font-mono uppercase tracking-widest font-bold">
                Available Now • Starting at $45,000
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 delay-200 animate-fade-in opacity-0 fill-mode-forwards">
              <button onClick={handleVisitDashboard} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full hover:scale-105 transition shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center gap-2">
                Visit Dashboard <i className="fa-solid fa-arrow-right"></i>
              </button>
              <button onClick={handleViewSpecsClick} className="border border-white hover:border-red-600 text-white hover:text-red-600 py-3 px-8 rounded-full transition bg-transparent hover:bg-white/5">
                View Specs
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: VISUALS (Width 55%) */}
          <div className="w-full md:w-[55%] relative h-[300px] md:h-[600px] flex items-center justify-end perspective-1000 mt-0 md:mt-0">
            
            {/* Car Image - Dynamically loaded from admin settings */}
            <div className="relative z-30 w-[110%] md:w-[130%] right-[5%] md:right-0 hover:scale-105 transition-transform duration-700">
              <img 
                src={heroImageUrl} 
                alt="BYD Seal White" 
                className="w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              />
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default Hero;