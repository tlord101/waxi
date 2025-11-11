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
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import { Vehicle, User } from './types';
import { addUser, loginUser } from './services/dbService';


export type Page = 'Home' | 'Vehicles' | 'Installment' | 'Giveaway' | 'About' | 'Contact' | 'Order' | 'Admin' | 'Login' | 'Signup' | 'Dashboard';
export type Theme = 'dark' | 'light';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Home');
  const [selectedVehicleForInstallment, setSelectedVehicleForInstallment] = useState<Vehicle | null>(null);
  const [selectedVehicleForPurchase, setSelectedVehicleForPurchase] = useState<Vehicle | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentPage('Home');
  };

  const handleUserLogin = (email: string, password: string): boolean => {
    // Check for admin credentials first
    if (email.toLowerCase() === 'admin@waxibyd.com' && password === 'admin101') {
      setIsAdminLoggedIn(true);
      setCurrentPage('Admin');
      return true;
    }

    // Proceed with regular user login
    const user = loginUser(email, password);
    if (user) {
      setCurrentUser(user);
      setCurrentPage('Dashboard');
      return true;
    }

    return false;
  };

  const handleUserSignup = (name: string, email: string, password: string): boolean => {
    const newUser = addUser(name, email, password);
    if (newUser) {
      setCurrentUser(newUser);
      setCurrentPage('Dashboard');
      return true;
    }
    return false;
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    setCurrentPage('Home');
  };
  
  const renderPage = () => {
    // Protected routes
    if (currentPage === 'Admin' && !isAdminLoggedIn) {
      return <LoginPage onLogin={handleUserLogin} setCurrentPage={setCurrentPage} />;
    }
    if (currentPage === 'Dashboard' && !currentUser) {
      return <LoginPage onLogin={handleUserLogin} setCurrentPage={setCurrentPage} />;
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
        return <OrderPage vehicle={selectedVehicleForPurchase} setCurrentPage={setCurrentPage} currentUser={currentUser} setCurrentUser={setCurrentUser} />;
      case 'Admin':
        return <AdminPage />;
      case 'Login':
        return <LoginPage onLogin={handleUserLogin} setCurrentPage={setCurrentPage} />;
      case 'Signup':
        return <SignupPage onSignup={handleUserSignup} setCurrentPage={setCurrentPage} />;
      case 'Dashboard':
        return <DashboardPage user={currentUser!} onLogout={handleUserLogout} setCurrentPage={setCurrentPage} setCurrentUser={setCurrentUser} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} onSelectForInstallment={handleSelectForInstallment} onSelectForPurchase={handleSelectForPurchase} />;
    }
  };

  return (
    <div className="font-sans flex flex-col min-h-screen animate-fade-in bg-white dark:bg-black transition-colors duration-400">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isAdminLoggedIn={isAdminLoggedIn}
        currentUser={currentUser}
        onAdminLogout={handleAdminLogout}
        onUserLogout={handleUserLogout}
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