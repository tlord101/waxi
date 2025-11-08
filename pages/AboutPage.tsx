import React, { useState, useEffect, useRef } from 'react';

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


const AboutPage: React.FC = () => {
  return (
    <div>
      {/* Banner Section */}
      <div className="relative h-[50vh] flex items-center justify-center text-center">
        <img src="https://picsum.photos/seed/wuxi-factory/1920/600" alt="Wuxi Factory" className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-30"/>
        <div className="relative z-10 p-6">
            <h1 className="text-5xl md:text-7xl font-extrabold text-byd-red drop-shadow-lg">WUXI BYD</h1>
            <p className="text-xl md:text-2xl mt-2 text-gray-800 dark:text-gray-200">Official BYD Export Office</p>
        </div>
      </div>
      
      {/* Main Content Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto space-y-12">
            <FadeInSection>
                <h2 className="text-4xl font-bold mb-4 text-center">
                    📘 Wuxi BYD Vehicle Co., Ltd — Company Profile
                </h2>
            </FadeInSection>

            <FadeInSection>
                <h3 className="text-2xl font-bold text-byd-red mb-3">What It Is:</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    A subsidiary of the BYD Group dedicated to the export sales of BYD vehicles.
                </p>
            </FadeInSection>

            <FadeInSection>
                <h3 className="text-2xl font-bold text-byd-red mb-3">Location:</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    Based in Wuxi, Jiangsu Province, China.
                </p>
            </FadeInSection>

            <FadeInSection>
                <h3 className="text-2xl font-bold text-byd-red mb-3">Core Business / Role:</h3>
                <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 dark:text-gray-300">
                    <li>Handles global distribution of BYD new-energy vehicles (EVs, hybrids) to overseas markets.</li>
                    <li>Manages the logistics chain from production → customs → overseas delivery.</li>
                    <li>Provides after-sales support for international customers, including parts warehousing, multi-language technical help, and OTA diagnostics.</li>
                </ul>
            </FadeInSection>

            <FadeInSection>
                <h3 className="text-2xl font-bold text-byd-red mb-3">Scale & Reach:</h3>
                <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 dark:text-gray-300">
                    <li>Operates in 30+ countries, delivering BYD vehicles globally.</li>
                    <li>Serves 100,000+ customers via its export network.</li>
                </ul>
            </FadeInSection>
            
            <FadeInSection>
                <h3 className="text-2xl font-bold text-byd-red mb-3">Value Proposition:</h3>
                <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 dark:text-gray-300">
                    <li>Offers factory-direct pricing to overseas importers, reducing costs.</li>
                    <li>Emphasizes “pre-certified homologation” — meaning vehicles are pre-approved for export markets to minimize compliance delays.</li>
                </ul>
            </FadeInSection>

            <FadeInSection>
                <h3 className="text-2xl font-bold text-byd-red mb-3">Recognition / Credibility:</h3>
                <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 dark:text-gray-300">
                    <li>Recognized as an “official BYD Export Office,” not a third-party trader.</li>
                    <li>Integral to BYD’s global strategy, leveraging BYD’s brand and manufacturing capacity.</li>
                </ul>
            </FadeInSection>

            {/* Contact Block */}
            <FadeInSection>
                <div className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-3xl font-bold text-byd-red mb-6 text-center">Contact Our Export Office</h3>
                    <div className="bg-gray-100 dark:bg-gray-900/50 p-8 rounded-lg space-y-4 text-lg max-w-2xl mx-auto">
                        <p className="flex items-start sm:items-center">
                            <span className="text-2xl mr-4 mt-1 sm:mt-0">📍</span>
                            <span>No. 985 Fengxiang Road, Liangxi District, Wuxi, China</span>
                        </p>
                        <p className="flex items-center">
                             <span className="text-2xl mr-4">📧</span>
                            <a href="mailto:info@bydvehicles.com" className="hover:text-byd-red transition-colors">info@bydvehicles.com</a>
                        </p>
                        <p className="flex items-center">
                            <span className="text-2xl mr-4">☎️</span>
                            <a href="tel:+86-173-6171-1305" className="hover:text-byd-red transition-colors">+86-173-6171-1305</a>
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