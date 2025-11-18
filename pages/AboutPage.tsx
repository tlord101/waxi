import React, { useState, useEffect, useRef } from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { Page } from '../types';

// Reusable component for fade-in animation on scroll
const FadeInSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Unobserve after it's visible so it doesn't re-trigger
          observer.unobserve(entry.target);
        }
      });
    });

    const { current } = domRef;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {children}
    </div>
  );
};


const AboutPage: React.FC<{ setCurrentPage: (page: Page) => void }> = ({ setCurrentPage }) => {
  const { content, isLoading } = useSiteContent();

  if (isLoading || !content?.aboutpage) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-byd-red text-2xl">Loading...</div>
        </div>
    );
  }
  
  const { aboutpage } = content;

  return (
    <div>
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <button
          onClick={() => setCurrentPage('Home')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-byd-red dark:hover:text-byd-red transition-colors"
        >
          <ion-icon name="arrow-back-outline" className="text-2xl"></ion-icon>
          <span className="font-semibold">Back to Home</span>
        </button>
      </div>
      
      {/* Banner Section */}
      <div className="relative h-[50vh] flex items-center justify-center text-center">
        <img src={aboutpage.banner_image_url} alt="Wuxi Factory" className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-30"/>
        <div className="relative z-10 p-6">
            <h1 className="text-5xl md:text-7xl font-extrabold text-byd-red drop-shadow-lg">{aboutpage.banner_title}</h1>
            <p className="text-xl md:text-2xl mt-2 text-gray-800 dark:text-gray-200">{aboutpage.banner_subtitle}</p>
        </div>
      </div>
      
      {/* Main Content Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto space-y-12">
            <FadeInSection>
                <h2 className="text-4xl font-bold mb-4 text-center">
                    <span>{aboutpage.main_title}</span>
                </h2>
            </FadeInSection>

            <FadeInSection>
                <div 
                    className="text-lg text-gray-700 dark:text-gray-300 space-y-4 whitespace-pre-wrap"
                    style={{ fontFamily: 'inherit' }} // Ensures it uses the main font, not a mono font like <pre>
                >
                  {aboutpage.main_content}
                </div>
            </FadeInSection>

            {/* Contact Block */}
            <FadeInSection>
                <div className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-3xl font-bold text-byd-red mb-6 text-center">{aboutpage.contact_title}</h3>
                    <div className="bg-gray-100 dark:bg-gray-900/50 p-8 rounded-lg space-y-4 text-lg max-w-2xl mx-auto">
                        <p className="flex items-start">
                            <i className="bi bi-geo-alt-fill text-2xl mr-4 text-byd-red mt-1"></i>
                            <span>{aboutpage.contact_address}</span>
                        </p>
                        <p className="flex items-center">
                             <i className="bi bi-envelope-fill text-2xl mr-4 text-byd-red"></i>
                            <a href={`mailto:${aboutpage.contact_email}`} className="hover:text-byd-red transition-colors">{aboutpage.contact_email}</a>
                        </p>
                        <p className="flex items-center">
                            <i className="bi bi-telephone-fill text-2xl mr-4 text-byd-red"></i>
                            <a href={`tel:${aboutpage.contact_phone.replace(/\s/g, '')}`} className="hover:text-byd-red transition-colors">{aboutpage.contact_phone}</a>
                        </p>
                    </div>
                </div>
            </FadeInSection>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;