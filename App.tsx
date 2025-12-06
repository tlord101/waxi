import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VehiclesPage from './pages/VehiclesPage';
import InstallmentPage from './pages/InstallmentPage';
import GiveawayPage from './pages/GiveawayPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LiveChatWidget from './components/AIAssistant'; 
import OrderPage from './pages/OrderPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import WalletPage from './pages/WalletPage';
import InvestmentsPage from './pages/InvestmentsPage';
import PurchasesPage from './pages/PurchasesPage';
import DepositPage from './pages/DepositPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import { SiteContentProvider } from './contexts/SiteContentContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
// FIX: Import Page and Theme from types.ts to break circular dependency
import { Vehicle, User, Order, Page, Theme } from './types';
import { auth } from './services/firebase'; // Import Firebase auth instance
import { 
  fetchVehicles, 
  getUser, 
  getPendingOrderForUser,
  signInWithGoogle,
  signUpUser,
  loginUser,
  logoutUser,
  ensureAdminUserExists,
  seedSiteContent,
} from './services/dbService';

// FIX: The global declaration for ion-icon was moved to index.tsx.
// This resolves an issue where it was overriding all other JSX intrinsic elements
// by ensuring it is loaded at the application's root.


// FIX: Moved Page and Theme types to types.ts to break a circular dependency.

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Home');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleForInstallment, setSelectedVehicleForInstallment] = useState<Vehicle | null>(null);
  const [selectedVehicleForPurchase, setSelectedVehicleForPurchase] = useState<Vehicle | null>(null);
  const [selectedVehicleForDetail, setSelectedVehicleForDetail] = useState<Vehicle | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appError, setAppError] = useState<string | null>(null);

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
    const initializeApp = async () => {
      // Ensure the admin user and initial site content are created if they don't exist.
      await ensureAdminUserExists();
      await seedSiteContent();

      try {
        const fetchedVehicles = await fetchVehicles();
        setVehicles(fetchedVehicles);
      } catch (error: any) {
        console.error("Critical error fetching initial data:", error);
        let friendlyMessage = "Failed to load application data. Please check your internet connection and try again.";
        // Check for the specific Firestore "database not found" error
        if (error.code === 'not-found' || (error.message && error.message.includes('does not exist for project'))) {
            friendlyMessage = "Connection to the database failed. The Firestore database has not been created for this project. Please contact the administrator to set it up in the Firebase console.";
        }
        setAppError(friendlyMessage);
      }
    };
    
    initializeApp();

    // Firebase Auth state listener
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
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
      } catch (error) {
          console.error("Error fetching user data on auth change:", error);
          if (!appError) { // Only set if no primary error is set
            setAppError("Failed to load user profile. Please try refreshing the page.");
          }
      } finally {
        setIsLoading(false);
      }
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
            try {
                const order = await getPendingOrderForUser(currentUser.id);
                setPendingOrder(order);
            } catch (error) {
                console.error("Could not check for pending orders:", error);
            }
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

  const handleSelectForDetail = (vehicle: Vehicle) => {
    setSelectedVehicleForDetail(vehicle);
    setCurrentPage('VehicleDetail');
  };

  const handleVisitDashboard = () => {
    if (isAdminLoggedIn) {
      setCurrentPage('Admin');
      setTimeout(() => window.dispatchEvent(new CustomEvent('open-dashboard-sidebar')), 120);
      return;
    }
    if (currentUser) {
      setCurrentPage('Dashboard');
      setTimeout(() => window.dispatchEvent(new CustomEvent('open-dashboard-sidebar')), 120);
      return;
    }
    setCurrentPage('Login');
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

  if (appError) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-4">
            <div className="max-w-2xl text-center">
                <div className="text-5xl mb-4 text-red-500" role="img" aria-label="error icon">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                </div>
                <h1 className="text-2xl font-bold text-byd-red mb-4">Application Error</h1>
                <p className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 p-4 rounded-md border border-red-500/30">
                    {appError}
                </p>
            </div>
        </div>
    );
  }

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
        return <HomePage vehicles={vehicles} setCurrentPage={setCurrentPage} onSelectForInstallment={handleSelectForInstallment} onSelectForPurchase={handleSelectForPurchase} onSelectForDetail={handleSelectForDetail} onVisitDashboard={handleVisitDashboard} currentUser={currentUser} isAdminLoggedIn={isAdminLoggedIn} />;
      case 'Vehicles':
        // The "Vehicles" page now renders the enhanced HomePage component which contains the full list.
        return <HomePage vehicles={vehicles} setCurrentPage={setCurrentPage} onSelectForInstallment={handleSelectForInstallment} onSelectForPurchase={handleSelectForPurchase} onSelectForDetail={handleSelectForDetail} onVisitDashboard={handleVisitDashboard} currentUser={currentUser} isAdminLoggedIn={isAdminLoggedIn} />;
      case 'Installment':
        return <InstallmentPage vehicle={selectedVehicleForInstallment} setCurrentPage={setCurrentPage} />;
      case 'Giveaway':
        return <GiveawayPage currentUser={currentUser} setCurrentUser={setCurrentUser} setCurrentPage={setCurrentPage} />;
      case 'About':
        return <AboutPage setCurrentPage={setCurrentPage} />;
      case 'Contact':
        return <ContactPage setCurrentPage={setCurrentPage} />;
      case 'Order':
        return <OrderPage vehicle={selectedVehicleForPurchase} setCurrentPage={setCurrentPage} currentUser={currentUser} setCurrentUser={setCurrentUser} pendingOrder={pendingOrder} />;
      case 'Admin':
        return <AdminPage onLogout={handleAdminLogout} setCurrentPage={setCurrentPage} />;
      case 'Login':
        return <LoginPage onLogin={handleUserLogin} onGoogleSignIn={handleGoogleSignIn} setCurrentPage={setCurrentPage} />;
      case 'Signup':
        return <SignupPage onSignup={handleUserSignup} onGoogleSignIn={handleGoogleSignIn} setCurrentPage={setCurrentPage} />;
      case 'Dashboard':
        return <DashboardPage user={currentUser!} onLogout={handleUserLogout} setCurrentPage={setCurrentPage} setCurrentUser={setCurrentUser} pendingOrder={pendingOrder} onCompletePurchase={handleCompletePurchase} />;
      case 'Wallet':
        return currentUser ? <WalletPage user={currentUser} currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleUserLogout} /> : <LoginPage onLogin={handleUserLogin} onGoogleSignIn={handleGoogleSignIn} setCurrentPage={setCurrentPage} />;
      case 'Investments':
        return currentUser ? <InvestmentsPage user={currentUser} setCurrentUser={setCurrentUser} currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleUserLogout} /> : <LoginPage onLogin={handleUserLogin} onGoogleSignIn={handleGoogleSignIn} setCurrentPage={setCurrentPage} />;
      case 'Purchases':
        return currentUser ? <PurchasesPage user={currentUser} currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleUserLogout} /> : <LoginPage onLogin={handleUserLogin} onGoogleSignIn={handleGoogleSignIn} setCurrentPage={setCurrentPage} />;
      case 'Deposit':
        return currentUser ? <DepositPage user={currentUser} setCurrentUser={setCurrentUser} currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleUserLogout} /> : <LoginPage onLogin={handleUserLogin} onGoogleSignIn={handleGoogleSignIn} setCurrentPage={setCurrentPage} />;
      case 'VehicleDetail':
        return <VehicleDetailPage vehicle={selectedVehicleForDetail} setCurrentPage={setCurrentPage} onSelectForPurchase={handleSelectForPurchase} onSelectForInstallment={handleSelectForInstallment} />;
      default:
        return <HomePage vehicles={vehicles} setCurrentPage={setCurrentPage} onSelectForInstallment={handleSelectForInstallment} onSelectForPurchase={handleSelectForPurchase} onSelectForDetail={handleSelectForDetail} />;
    }
  };

  const dashboardPagesToHideNavbar: Page[] = ['VehicleDetail', 'Dashboard', 'Admin', 'Wallet', 'Investments', 'Purchases', 'Deposit'];
  const shouldShowNavbarAndFooter = !dashboardPagesToHideNavbar.includes(currentPage);

  return (
    <SiteContentProvider>
      <CurrencyProvider>
        <div className="font-sans flex flex-col min-h-screen animate-fade-in bg-white dark:bg-black transition-colors duration-400">
          {shouldShowNavbarAndFooter && (
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
          )}
          <main className="flex-grow text-black dark:text-white">
            {renderPage()}
          </main>
          {shouldShowNavbarAndFooter && <Footer />}
          <LiveChatWidget user={currentUser} />
        </div>
      </CurrencyProvider>
    </SiteContentProvider>
  );
};

export default App;