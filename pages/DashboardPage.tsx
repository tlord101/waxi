import React, { useState, useEffect, useRef } from 'react';
// FIX: Import Page from types.ts to break circular dependency.
import { User, Investment, Order, Page, Deposit } from '../types';
import { getInvestmentsForUser, addInvestment, updateUser, getPendingDepositForUser, addDeposit, updateDeposit } from '../services/dbService';
import { sendDepositRequestToAgent, sendDepositReceiptToAgent } from '../services/emailService';
import PaymentModal from '../components/PaymentModal';
import { useSiteContent } from '../contexts/SiteContentContext';

type DashboardTab = 'Wallet' | 'Investments' | 'Purchases' | 'Deposit Funds';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
  setCurrentPage: (page: Page) => void;
  setCurrentUser: (user: User) => void;
  pendingOrder: Order | null;
  onCompletePurchase: (order: Order) => void;
}

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setCurrentPage: (page: Page) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen, setCurrentPage }) => {
  const tabs: { name: DashboardTab, icon: string }[] = [
    { name: 'Wallet', icon: 'wallet-outline' },
    { name: 'Investments', icon: 'analytics-outline' },
    { name: 'Purchases', icon: 'receipt-outline' },
    { name: 'Deposit Funds', icon: 'add-circle-outline' },
  ];

  const handleTabClick = (tab: DashboardTab) => {
    setActiveTab(tab);
    setIsOpen(false); // Close sidebar on mobile after selection
  };
  
  const handleHomeClick = () => {
    setCurrentPage('Home');
    setIsOpen(false);
  }

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 w-12 h-12 rounded-full bg-byd-red shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-byd-red"
        aria-label="Open menu"
      >
        {/* White three-line hamburger SVG icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="3" y="6" width="18" height="2" rx="1" fill="white" />
          <rect x="3" y="11" width="18" height="2" rx="1" fill="white" />
          <rect x="3" y="16" width="18" height="2" rx="1" fill="white" />
        </svg>
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-50 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 z-60 transform transition-transform duration-300 ease-in-out md:static md:w-64 md:h-auto md:transform-none md:z-auto md:flex-shrink-0 md:rounded-lg md:border ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
      >
        <div className="p-4 flex justify-between items-center md:hidden border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-bold text-lg text-black dark:text-white">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-2xl text-gray-500 dark:text-gray-400 hover:text-byd-red transition-colors"
            aria-label="Close menu"
          >
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        <div className="p-4">
          <nav className="flex flex-col space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab.name)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors duration-200 ${
                  activeTab === tab.name ? 'bg-byd-red text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white'
                }`}
              >
                <ion-icon name={tab.icon} className="text-xl"></ion-icon>
                <span className="font-semibold">{tab.name}</span>
              </button>
            ))}
          </nav>
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleHomeClick}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white`}
            >
              <ion-icon name="home-outline" className="text-xl"></ion-icon>
              <span className="font-semibold">Back to Home</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};


const DashboardContent: React.FC<{ 
    activeTab: DashboardTab; 
    user: User; 
    setCurrentPage: (page: Page) => void; 
    setActiveTab: (tab: DashboardTab) => void; 
    setCurrentUser: (user: User) => void;
}> = ({ activeTab, user, setCurrentPage, setActiveTab, setCurrentUser }) => {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [investmentError, setInvestmentError] = useState('');
    const { content } = useSiteContent();
    const paymentSettings = content?.paymentSettings;
    
    // State for Deposit tab
    const [depositAmount, setDepositAmount] = useState('');
    const [depositError, setDepositError] = useState('');
    const [pendingDeposit, setPendingDeposit] = useState<Deposit | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);


    const fetchUserInvestments = async () => {
        const userInvestments = await getInvestmentsForUser(user.id);
        setInvestments(userInvestments);
    };

    const checkPendingDeposit = async () => {
        const deposit = await getPendingDepositForUser(user.id);
        setPendingDeposit(deposit);
    }

    useEffect(() => {
        if (activeTab === 'Investments') {
            fetchUserInvestments();
        }
        if (activeTab === 'Deposit Funds') {
            checkPendingDeposit();
        }
    }, [activeTab, user.id]);

    const handleInvestment = async () => {
        const amount = parseFloat(investmentAmount);
        setInvestmentError('');

        if (isNaN(amount) || amount <= 0) {
            setInvestmentError('Please enter a valid amount.');
            return;
        }
        if (amount > user.balance) {
            setInvestmentError('Insufficient balance for this investment.');
            return;
        }

        // 1. Update database
        await addInvestment({
            userId: user.id,
            amount,
            description: `User Investment #${Math.floor(Math.random() * 1000)}`
        });
        const newBalance = user.balance - amount;
        await updateUser(user.id, { balance: newBalance });

        // 2. Update local state
        setCurrentUser({ ...user, balance: newBalance });
        await fetchUserInvestments(); // Refresh list
        setInvestmentAmount('');
        alert(`Successfully invested ¥${amount.toLocaleString()}`);
    };

     const handleProceedToDeposit = () => {
        const amount = parseFloat(depositAmount);
        setDepositError('');
        if (isNaN(amount) || amount <= 0) {
            setDepositError('Please enter a valid amount to deposit.');
            return;
        }
        setIsPaymentModalOpen(true);
    };

    const handleSelectDepositMethod = async (method: 'crypto' | 'bank') => {
        const amount = parseFloat(depositAmount);
        setIsPaymentModalOpen(false);

        // 1. Create a new deposit record in the database
        const newDeposit = await addDeposit({
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            amount: amount,
            method: method === 'crypto' ? 'Crypto' : 'Bank Deposit',
        });
        setPendingDeposit(newDeposit);

        // 2. Notify agent to send payment details to the customer
        await sendDepositRequestToAgent({
            userName: user.name,
            userEmail: user.email,
            amount: amount,
            method: method === 'crypto' ? 'Crypto' : 'Bank Deposit',
        });

        setDepositAmount(''); // Clear the input
    };

     const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
        setReceiptFile(e.target.files[0]);
        }
    };

    const handleSubmitDepositReceipt = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!receiptFile || !pendingDeposit) {
            alert("Please select a receipt file to upload.");
            return;
        }
        setIsSubmittingReceipt(true);
        
        try {
            // 1. Simulate file upload and get a URL
            const fakeReceiptUrl = `https://example.com/receipts/deposits/${pendingDeposit.id}/${receiptFile.name}`;

            // 2. Update deposit status in the database
            const updates: Partial<Deposit> = {
                status: 'Verifying',
                receipt_url: fakeReceiptUrl,
            };
            await updateDeposit(pendingDeposit.id, updates);

            // 3. Notify agent that receipt has been submitted
            await sendDepositReceiptToAgent({
                userName: user.name,
                userEmail: user.email,
                depositId: pendingDeposit.id,
                amount: pendingDeposit.amount,
                receiptUrl: fakeReceiptUrl,
            });

            // 4. Update local state to reflect the change
            setPendingDeposit({ ...pendingDeposit, ...updates });
            setReceiptFile(null);

        } catch (error) {
            alert("An error occurred while submitting your receipt. Please try again.");
            console.error("Receipt submission error:", error);
        } finally {
            setIsSubmittingReceipt(false);
        }
    };

    const renderContent = () => {
    switch (activeTab) {
      case 'Wallet':
        return (
          <div className="animate-fade-in space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Here's a summary of your account wallet.</p>
              <div className="bg-gradient-to-br from-byd-red to-byd-red-dark text-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
                  <p className="text-lg opacity-80">Current Balance</p>
                  <p className="text-5xl font-extrabold tracking-tight my-2">¥{user.balance.toLocaleString()}</p>
                  <button 
                    onClick={() => setActiveTab('Deposit Funds')}
                    className="mt-6 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 backdrop-blur-sm"
                  >
                    <span className="flex items-center gap-2">
                      {/* FIX: Corrected ion-icon usage to ensure proper rendering and type compatibility. */}
                      <ion-icon name="add-circle-outline"></ion-icon>
                      <span>Deposit Funds</span>
                    </span>
                  </button>
              </div>
            </div>
            <div>
                <h2 className="text-3xl font-bold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => setCurrentPage('Vehicles')} className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg text-left hover:ring-2 hover:ring-byd-red transition-all">
                        <h3 className="font-bold text-lg text-black dark:text-white">Buy a Car</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Use your balance for a new vehicle purchase.</p>
                    </button>
                     <button onClick={() => setActiveTab('Investments')} className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg text-left hover:ring-2 hover:ring-byd-red transition-all">
                        <h3 className="font-bold text-lg text-black dark:text-white">Invest</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Explore investment opportunities.</p>
                    </button>
                    <button onClick={() => setCurrentPage('Giveaway')} className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg text-left hover:ring-2 hover:ring-byd-red transition-all">
                        <h3 className="font-bold text-lg text-black dark:text-white">Apply for Giveaway</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Enter the current giveaway event.</p>
                    </button>
                    <button onClick={() => setCurrentPage('Installment')} className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg text-left hover:ring-2 hover:ring-byd-red transition-all">
                        <h3 className="font-bold text-lg text-black dark:text-white">Settle Installments</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage and pay your active installment plans.</p>
                    </button>
                </div>
            </div>
          </div>
        );
      case 'Investments':
        return (
            <div className="animate-fade-in space-y-8">
                <div>
                    <h2 className="text-3xl font-bold mb-6">Make an Investment from Wallet</h2>
                    {paymentSettings?.investment?.wallet_enabled ? (
                        <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg">
                            {investmentError && <p className="text-red-500 text-sm mb-2">{investmentError}</p>}
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input 
                                    type="number" 
                                    placeholder={`Amount (Balance: ¥${user.balance.toLocaleString()})`} 
                                    value={investmentAmount}
                                    onChange={e => setInvestmentAmount(e.target.value)}
                                    className="flex-grow p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-byd-red focus:border-byd-red" 
                                />
                                <button onClick={handleInvestment} className="bg-byd-red text-white py-3 px-8 rounded-md font-semibold hover:bg-byd-red-dark transition-colors">
                                    Invest Now
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-100 dark:bg-yellow-800/50 p-6 rounded-lg text-center text-yellow-800 dark:text-yellow-300">
                            <p>Wallet-based investments are currently disabled by the administrator.</p>
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="text-3xl font-bold mb-6">Investment History</h2>
                    {investments.length > 0 ? (
                        <div className="space-y-4">
                            {investments.map(inv => (
                                <div key={inv.id} className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-black dark:text-white">{inv.description}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(inv.date).toLocaleDateString()}</p>
                                    </div>
                                    <p className="font-bold text-lg text-green-600 dark:text-green-400">+ ¥{inv.amount.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                            <p className="text-gray-500 dark:text-gray-400">No active investments found.</p>
                        </div>
                    )}
                </div>
            </div>
        );
      case 'Purchases':
        return (
            <div className="animate-fade-in">
                <h2 className="text-3xl font-bold mb-6">Pending Purchases</h2>
                <div className="text-center py-12 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">You have no pending purchases.</p>
                </div>
            </div>
        );
      case 'Deposit Funds':
        return (
            <div className="animate-fade-in">
                <h2 className="text-3xl font-bold mb-6">Make a Deposit</h2>
                {pendingDeposit ? (
                     <>
                        {pendingDeposit.status === 'Awaiting Receipt' && (
                            <div className="bg-blue-500/10 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 p-6 rounded-r-lg">
                                <ion-icon name="mail-outline" className="text-5xl mb-2 mx-auto block"></ion-icon>
                                <h3 className="font-bold text-xl text-center">Deposit Initiated</h3>
                                <p className="mt-2 text-center">
                                    Your deposit request for <strong>¥{pendingDeposit.amount.toLocaleString()}</strong> has been submitted.
                                    Please check your email at <strong>{user.email}</strong> for payment instructions from our agent.
                                </p>
                                <form onSubmit={handleSubmitDepositReceipt} className="mt-6 p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                                    <h4 className="font-bold text-lg mb-2 text-center text-black dark:text-white">Upload Your Receipt</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">After making the payment, upload the receipt here to complete the process.</p>
                                    <div className="mb-4">
                                        <label htmlFor="deposit-receipt-upload" className="block w-full cursor-pointer bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-byd-red dark:hover:border-byd-red">
                                            {receiptFile ? (
                                                <span className="text-green-500">{receiptFile.name}</span>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">Click to select a file</span>
                                            )}
                                            <input id="deposit-receipt-upload" type="file" className="hidden" onChange={handleReceiptFileChange} accept="image/*,.pdf" required />
                                        </label>
                                    </div>
                                    <button type="submit" disabled={isSubmittingReceipt || !receiptFile} className="w-full bg-byd-red text-white py-3 px-8 rounded-full font-semibold hover:bg-byd-red-dark transition-colors disabled:bg-gray-500">
                                        {isSubmittingReceipt ? 'Submitting...' : 'Submit Receipt'}
                                    </button>
                                </form>
                            </div>
                        )}
                        {pendingDeposit.status === 'Verifying' && (
                            <div className="bg-green-100/50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-600 p-6 rounded-lg text-center">
                                <ion-icon name="time-outline" className="text-5xl mb-2 text-green-600 dark:text-green-500"></ion-icon>
                                <h3 className="font-bold text-xl text-green-800 dark:text-green-500">Receipt Submitted for Verification</h3>
                                <p className="mt-4 text-gray-700 dark:text-gray-300">
                                    We have received your receipt for the <strong className="font-bold text-green-700 dark:text-green-500">¥{pendingDeposit.amount.toLocaleString()}</strong> deposit.
                                </p>
                                <p className="mt-1 text-gray-700 dark:text-gray-300">Our team is reviewing it and will credit your account shortly. This usually takes a few hours.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg">
                        <p className="mb-4">Enter the amount you wish to deposit into your account.</p>
                        {depositError && <p className="text-red-500 text-sm mb-2">{depositError}</p>}
                        <input 
                          type="number" 
                          placeholder="¥0.00" 
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-byd-red focus:border-byd-red" 
                        />
                        <button 
                          onClick={handleProceedToDeposit}
                          className="mt-4 w-full bg-byd-red text-white py-3 px-8 rounded-full font-semibold hover:bg-byd-red-dark transition-colors"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                )}
                 <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onSelectPayment={handleSelectDepositMethod}
                />
            </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="bg-white dark:bg-black p-4 md:p-8 rounded-lg border border-gray-200 dark:border-gray-800">
      {renderContent()}
    </div>
  );
};

const FloatingActionButton: React.FC<{ order: Order; onClick: () => void }> = ({ order, onClick }) => (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-20 bg-byd-red text-white py-3 px-5 rounded-full shadow-2xl flex items-center justify-center hover:bg-byd-red-dark transition-all duration-300 transform hover:scale-105 group"
      aria-label={`Complete purchase for ${order.vehicle_name}`}
    >
        {/* FIX: Replaced class with className for ion-icon custom element */}
        <ion-icon name="cloud-upload-outline" className="text-2xl"></ion-icon>
        <span className="ml-2 font-semibold">Upload Receipt</span>
    </button>
);

const PendingPurchaseAlert: React.FC<{ order: Order; onClick: () => void }> = ({ order, onClick }) => (
    <div className="mb-8 p-4 bg-green-400/10 border-l-4 border-green-500 text-green-700 dark:text-green-300 rounded-r-lg shadow-md animate-fade-in">
        <div className="flex items-center justify-between">
            <div>
                <p className="font-bold">Action Required</p>
                <p>You have a pending purchase for the <strong>{order.vehicle_name}</strong>. Please upload your payment receipt to complete the order.</p>
            </div>
            <button
                onClick={onClick}
                className="ml-4 flex-shrink-0 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
                Complete Purchase
            </button>
        </div>
    </div>
);


const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout, setCurrentPage, setCurrentUser, pendingOrder, onCompletePurchase }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('Wallet');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Header show/hide on scroll and back handling
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="py-16">
      <div className="container mx-auto px-6">
        <div className={`sticky top-4 z-50 bg-white/70 dark:bg-black/60 backdrop-blur-sm p-3 rounded-md mb-6 border border-gray-100 dark:border-gray-800 transform transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-24'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold ml-2">My Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onLogout}
                className="bg-white dark:bg-gray-900 text-black dark:text-white py-2 px-4 rounded-full hover:opacity-90 transition-colors duration-200 font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-byd-red focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {pendingOrder && (
            <PendingPurchaseAlert order={pendingOrder} onClick={() => onCompletePurchase(pendingOrder)} />
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <DashboardSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            setCurrentPage={setCurrentPage}
          />
          <main className="flex-1">
            <DashboardContent 
                activeTab={activeTab} 
                user={user} 
                setCurrentPage={setCurrentPage} 
                setActiveTab={setActiveTab} 
                setCurrentUser={setCurrentUser}
            />
          </main>
        </div>
      </div>
      {pendingOrder && (
        <FloatingActionButton order={pendingOrder} onClick={() => onCompletePurchase(pendingOrder)} />
      )}
    </div>
  );
};

export default DashboardPage;