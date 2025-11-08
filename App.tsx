import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VehiclesPage from './pages/VehiclesPage';
import InstallmentPage from './pages/InstallmentPage';
import GiveawayPage from './pages/GiveawayPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AIAssistant from './components/AIAssistant';
import OrderPage from './pages/OrderPage';
import AdminPage from './pages/AdminPage';
import { Vehicle } from './types';

export type Page = 'Home' | 'Vehicles' | 'Installment' | 'Giveaway' | 'About' | 'Contact' | 'Order' | 'Admin';
export type Theme = 'dark' | 'light';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Home');
  const [selectedVehicleForInstallment, setSelectedVehicleForInstallment] = useState<Vehicle | null>(null);
  const [selectedVehicleForPurchase, setSelectedVehicleForPurchase] = useState<Vehicle | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('byd-theme-mode')) {
      return localStorage.getItem('byd-theme-mode') as Theme;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('byd-theme-mode', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSelectForInstallment = (vehicle: Vehicle) => {
    setSelectedVehicleForInstallment(vehicle);
    setCurrentPage('Installment');
  };
  
  const handleSelectForPurchase = (vehicle: Vehicle) => {
    setSelectedVehicleForPurchase(vehicle);
    setCurrentPage('Order');
  };

  const handleLogin = (password: string): boolean => {
    if (password === 'admin123') {
      setIsLoggedIn(true);
      setCurrentPage('Admin');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('Home');
  };
  
  const renderPage = () => {
    if (currentPage === 'Admin' && !isLoggedIn) {
      return <HomePage setCurrentPage={setCurrentPage} onSelectForInstallment={handleSelectForInstallment} onSelectForPurchase={handleSelectForPurchase} />;
    }

    switch (currentPage) {
      case 'Home':
        return <HomePage setCurrentPage={setCurrentPage} onSelectForInstallment={handleSelectForInstallment} onSelectForPurchase={handleSelectForPurchase} />;
      case 'Vehicles':
        return <VehiclesPage setCurrentPage={setCurrentPage} onSelectForInstallment={handleSelectForInstallment} onSelectForPurchase={handleSelectForPurchase} />;
      case 'Installment':
        return <InstallmentPage vehicle={selectedVehicleForInstallment} setCurrentPage={setCurrentPage} />;
      case 'Giveaway':
        return <GiveawayPage />;
      case 'About':
        return <AboutPage />;
      case 'Contact':
        return <ContactPage />;
      case 'Order':
        return <OrderPage vehicle={selectedVehicleForPurchase} setCurrentPage={setCurrentPage} />;
      case 'Admin':
        return <AdminPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} onSelectForInstallment={handleSelectForInstallment} onSelectForPurchase={handleSelectForPurchase} />;
    }
  };

  return (
    <div className="font-sans flex flex-col min-h-screen animate-fade-in bg-white dark:bg-black transition-colors duration-400">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="flex-grow text-black dark:text-white">
        {renderPage()}
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default App;