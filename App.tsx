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
import { Vehicle, User, Order } from './types';
import { auth } from './services/firebase'; // Import Firebase auth instance
import { 
  fetchVehicles, 
  getUser, 
  getPendingOrderForUser,
  signInWithGoogle,
  signUpUser,
  loginUser,
  logoutUser
} from './services/dbService';


export type Page = 'Home' | 'Vehicles' | 'Installment' | 'Giveaway' | 'About' | 'Contact' | 'Order' | 'Admin' | 'Login' | 'Signup' | 'Dashboard';
export type Theme = 'dark' | 'light';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Home');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleForInstallment, setSelectedVehicleForInstallment] = useState<Vehicle | null>(null);
  const [selectedVehicleForPurchase, setSelectedVehicleForPurchase] = useState<Vehicle | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    // Fetch vehicles on initial load
    const loadVehicles = async () => {
      const fetchedVehicles = await fetchVehicles();
      setVehicles(fetchedVehicles);
    };
    loadVehicles();

    // Firebase Auth state listener
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in.
        const userDoc = await getUser(firebaseUser.uid);
        if (userDoc) {
          setCurrentUser(userDoc);
          // Check for admin
          if (userDoc.email.toLowerCase() === 'admin@waxibyd.com') {
             setIsAdminLoggedIn(true);
          }
        }
      } else {
        // User is signed out.
        setCurrentUser(null);
        setIsAdminLoggedIn(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('byd-theme-mode', theme);
  }, [theme]);

  // Check for pending order whenever the current user changes (login, logout, refresh)
  useEffect(() => {
    const checkPendingOrder = async () => {
        if (currentUser) {
            const order = await getPendingOrderForUser(currentUser.id);
            setPendingOrder(order);
        } else {
            setPendingOrder(null);
        }
    }
    checkPendingOrder();
  }, [currentUser]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSelectForInstallment = (vehicle: Vehicle) => {
    setSelectedVehicleForInstallment(vehicle);
    setCurrentPage('Installment');
  };
  
  const handleSelectForPurchase = (vehicle: Vehicle) => {
    if (!currentUser) {
      // Users must be logged in to make a purchase. Redirect to login page.
      setCurrentPage('Login');
    } else {
      setSelectedVehicleForPurchase(vehicle);
      setCurrentPage('Order');
    }
  };

  const handleAdminLogout = async () => {
    await logoutUser();
    setIsAdminLoggedIn(false);
    setCurrentPage('Home');
  };

  const handleUserLogin = async (email: string, password: string): Promise<string> => {
     try {
        const user = await loginUser(email, password);
        if (user) {
            if (email.toLowerCase() === 'admin@waxibyd.com') {
                setIsAdminLoggedIn(true);
                setCurrentPage('Admin');
            } else {
                setCurrentPage('Dashboard');
            }
            return 'success';
        }
        return 'Invalid email or password.';
    } catch (error) {
        console.error("Login error:", error);
        return 'An unexpected error occurred.';
    }
  };

  const handleGoogleSignIn = async () => {
    try {
        const user = await signInWithGoogle();
        if (user) {
            setCurrentPage('Dashboard');
        }
    } catch (error) {
        console.error("Google Sign-in Error:", error);
        alert("Failed to sign in with Google. Please try again.");
    }
  };

  const handleUserSignup = async (name: string, email: string, password: string): Promise<string> => {
    try {
        const result = await signUpUser(name, email, password);
        if (result.success && result.user) {
            setCurrentPage('Dashboard');
            return 'success';
        }
        return result.error || 'An unknown error occurred.';
    } catch (error) {
        console.error("Signup error:", error);
        return 'An unexpected server error occurred.';
    }
  };

  const handleUserLogout = async () => {
    await logoutUser();
    setCurrentPage('Home');
  };

  const handleCompletePurchase = (order: Order) => {
    const vehicle = vehicles.find(v => v.id === order.vehicle_id);
    if (vehicle) {
        setSelectedVehicleForPurchase(vehicle);
        setCurrentPage('Order');
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
            <div className="text-byd-red text-4xl font-bold">Loading...</div>
        </div>
    );
  }
  
  const renderPage = () => {
    // Protected routes
    if (currentPage === 'Admin' && !isAdminLoggedIn) {
      return <LoginPage onLogin={handleUserLogin} onGoogleSignIn={handleGoogleSignIn} setCurrentPage={setCurrentPage} />;
    }
    if ((currentPage === 'Dashboard' || currentPage === 'Order') && !currentUser) {
      return <LoginPage onLogin={handleUserLogin} onGoogleSignIn={handleGoogleSignIn} setCurrentPage={setCurrentPage} />;
    }

    switch (currentPage) {
      case 'Home':
        return <HomePage vehicles={vehicles} setCurrentPage={setCurrentPage} onSelectForInstallment={handleSelectForInstallment} onSelectForPurchase={handleSelectForPurchase} />;
      case 'Vehicles':
        return <VehiclesPage vehicles={vehicles} setCurrentPage={setCurrentPage} onSelectForInstallment={handleSelectForInstallment} onSelectForPurchase={handleSelectForPurchase} />;
      case 'Installment':
        return <InstallmentPage vehicle={selectedVehicleForInstallment} setCurrentPage={setCurrentPage} />;
      case 'Giveaway':
        return <GiveawayPage />;
      case 'About':
        return <AboutPage />;
      case 'Contact':
        return <ContactPage />;
      case 'Order':
        return <OrderPage vehicle={selectedVehicleForPurchase} setCurrentPage={setCurrentPage} currentUser={currentUser} setCurrentUser={setCurrentUser} pendingOrder={pendingOrder} />;
      case 'Admin':
        return <AdminPage />;
      case 'Login':
        return <LoginPage onLogin={handleUserLogin} onGoogleSignIn={handleGoogleSignIn} setCurrentPage={setCurrentPage} />;
      case 'Signup':
        return <SignupPage onSignup={handleUserSignup} onGoogleSignIn={handleGoogleSignIn} setCurrentPage={setCurrentPage} />;
      case 'Dashboard':
        return <DashboardPage user={currentUser!} onLogout={handleUserLogout} setCurrentPage={setCurrentPage} setCurrentUser={setCurrentUser} pendingOrder={pendingOrder} onCompletePurchase={handleCompletePurchase} />;
      default:
        return <HomePage vehicles={vehicles} setCurrentPage={setCurrentPage} onSelectForInstallment={handleSelectForInstallment} onSelectForPurchase={handleSelectForPurchase} />;
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