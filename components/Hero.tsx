
import React, { useState, useEffect } from 'react';

const slides = [
  {
    image: 'https://picsum.photos/seed/bydhero1/1920/1080',
    car: 'BYD SEAL',
    slogan: 'Elegance in Motion'
  },
  {
    image: 'https://picsum.photos/seed/bydhero2/1920/1080',
    car: 'BYD ATTO 3',
    slogan: 'Energize Your World'
  },
  {
    image: 'https://picsum.photos/seed/bydhero3/1920/1080',
    car: 'BYD HAN EV',
    slogan: 'The Future of Luxury'
  },
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[80vh] overflow-hidden text-white">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={slide.image} alt={slide.car} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in-down">Future Starts Now</h1>
        <p className="text-xl md:text-2xl font-light animate-fade-in-up">{slides[currentSlide].car} - {slides[currentSlide].slogan}</p>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
            <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentSlide ? 'bg-byd-red' : 'bg-white/50 hover:bg-white'}`}
            ></button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
