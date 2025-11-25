import React, { useState, useEffect } from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { User, Page, GiveawayEntry } from '../types';
import { addGiveawayEntry, updateGiveawayEntry, updateUser } from '../services/dbService';
import { sendGiveawayConfirmation, sendGiveawayPaymentRequestToAgent, sendGiveawayReceiptToAgent } from '../services/emailService';

interface GiveawayPageProps {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  setCurrentPage: (page: Page) => void;
}

const COUNTRIES = ["China", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "Other"];

// HAN EV pricing
const HAN_EV_PRICE = 239800;
const ORIGINAL_PRICE = Math.round(HAN_EV_PRICE * 1.3); // 30% more than sale price
const DISCOUNT_AMOUNT = 40000;

const GiveawayPage: React.FC<GiveawayPageProps> = ({ currentUser, setCurrentUser, setCurrentPage }) => {
  const { content, isLoading } = useSiteContent();
  const paymentSettings = content?.paymentSettings?.giveaway;

  const [step, setStep] = useState<'FORM' | 'PAYMENT' | 'AWAITING_RECEIPT' | 'SUCCESS'>('FORM');
  const [currentEntry, setCurrentEntry] = useState<GiveawayEntry | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: 'China',
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({ ...prev, name: currentUser.name, email: currentUser.email }));
    }
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // FIX: Conditionally build the entry payload to avoid sending 'userId: undefined' to Firestore
      // when the user is not logged in.
      const entryPayload: Omit<GiveawayEntry, 'id' | 'raffle_code' | 'receipt_url'> = {
        name: formData.name,
        email: formData.email,
        country: formData.country,
        payment_status: 'Pending',
        winner_status: 'No',
      };

      if (currentUser) {
        entryPayload.userId = currentUser.id;
      }

      const newEntry = await addGiveawayEntry(entryPayload);
      setCurrentEntry(newEntry);
      setStep('PAYMENT');
    } catch (error) {
      console.error("Failed to create giveaway entry record:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayWithWallet = async () => {
    if (!currentUser || !paymentSettings || currentUser.balance < paymentSettings.fee_cny || !currentEntry) {
      alert("Insufficient funds or error.");
      return;
    }
    setIsProcessing(true);
    try {
      const newBalance = currentUser.balance - paymentSettings.fee_cny;
      await updateUser(currentUser.id, { balance: newBalance });
      setCurrentUser({ ...currentUser, balance: newBalance });

      await updateGiveawayEntry(currentEntry.id, { payment_status: 'Paid' });
      await sendGiveawayConfirmation(formData.email, { name: formData.name, raffleCode: currentEntry.raffle_code });

      setCurrentEntry(prev => prev ? { ...prev, payment_status: 'Paid' } : null);
      setStep('SUCCESS');
    } catch (error) {
      console.error("Wallet payment failed:", error);
      alert("An error occurred during payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayWithAgent = async () => {
    if (!paymentSettings || !currentEntry) return;
    setIsProcessing(true);
    try {
      await updateGiveawayEntry(currentEntry.id, { payment_status: 'Awaiting Receipt' });
      await sendGiveawayPaymentRequestToAgent({
        customerName: formData.name,
        customerEmail: formData.email,
        fee: paymentSettings.fee_cny,
      });
      setCurrentEntry(prev => prev ? { ...prev, payment_status: 'Awaiting Receipt' } : null);
      setStep('AWAITING_RECEIPT');
    } catch (error) {
      console.error("Agent payment request failed:", error);
      alert("An error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleSubmitReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile || !currentEntry) return;
    setIsProcessing(true);
    try {
      // In a real app, you would upload to a storage service
      const fakeReceiptUrl = `https://example.com/receipts/giveaway/${currentEntry.id}/${receiptFile.name}`;
      await updateGiveawayEntry(currentEntry.id, {
        payment_status: 'Verifying',
        receipt_url: fakeReceiptUrl,
      });
      await sendGiveawayReceiptToAgent({
        customerName: formData.name,
        customerEmail: formData.email,
        entryId: currentEntry.id,
        receiptUrl: fakeReceiptUrl,
      });
      setCurrentEntry(prev => prev ? { ...prev, payment_status: 'Verifying' } : null);
    } catch (error) {
       console.error("Receipt submission failed:", error);
       alert("An error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };


  const renderFormStep = () => (
    <div className="max-w-lg mx-auto bg-white/20 dark:bg-black/20 backdrop-blur-sm p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-2 text-center">Enter the Giveaway</h2>
      <p className="text-center text-gray-800 dark:text-gray-300 mb-6">{content?.homepage?.giveaway_description}</p>
      <form onSubmit={handleProceedToPayment} className="space-y-6">
        <div>
          <input
            type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required
            className="w-full bg-white/50 dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-byd-red focus:border-byd-red"
          />
        </div>
        <div>
          <input
            type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required
            className="w-full bg-white/50 dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-byd-red focus:border-byd-red"
          />
        </div>
        <div>
          <select
            name="country" value={formData.country} onChange={handleInputChange} required
            className="w-full bg-white/50 dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-byd-red focus:border-byd-red appearance-none"
          >
            {COUNTRIES.map(c => <option key={c} value={c} className="bg-white text-black">{c}</option>)}
          </select>
        </div>
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-byd-red text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-byd-red-dark transition-colors duration-300 disabled:bg-gray-500"
        >
          {isProcessing ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </form>
    </div>
  );

  const renderPaymentStep = () => {
    const canAfford = currentUser && paymentSettings && currentUser.balance >= paymentSettings.fee_cny;
    return (
        <div className="max-w-lg mx-auto bg-white/20 dark:bg-black/20 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Confirm Your Entry</h2>
            <p className="text-gray-800 dark:text-gray-300 mb-6">
                Please complete the non-refundable entry fee of <strong>¥{paymentSettings?.fee_cny.toLocaleString()}</strong> to enter the giveaway.
            </p>
            <div className="space-y-4">
                {paymentSettings?.wallet_enabled && currentUser && (
                    canAfford ? (
                        <button onClick={handlePayWithWallet} disabled={isProcessing} className="w-full bg-green-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-500">
                            {isProcessing ? 'Processing...' : `Pay with Wallet (Balance: ¥${currentUser.balance.toLocaleString()})`}
                        </button>
                    ) : (
                         <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-lg text-center">
                            <p className="font-bold">Insufficient Funds in Wallet</p>
                        </div>
                    )
                )}
                {paymentSettings?.agent_enabled && (
                     <button onClick={handlePayWithAgent} disabled={isProcessing} className="w-full bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-500">
                        {isProcessing ? 'Processing...' : 'Pay with Agent (Bank/Crypto)'}
                    </button>
                )}
                 {!paymentSettings?.wallet_enabled && !paymentSettings?.agent_enabled && (
                     <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-center">
                        <p className="font-bold">Payments Disabled</p>
                        <p className="text-sm">Giveaway entries are currently unavailable. Please contact support.</p>
                    </div>
                 )}
            </div>
            <button onClick={() => setStep('FORM')} className="mt-4 text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline">
              Go back
            </button>
        </div>
    );
  };
  
  const renderAwaitingReceiptStep = () => {
    if (currentEntry?.payment_status === 'Verifying') {
        return (
            <div className="max-w-lg mx-auto bg-white/20 dark:bg-black/20 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center">
                <ion-icon name="time-outline" className="text-green-400 text-7xl mb-4"></ion-icon>
                <h2 className="text-3xl font-bold mb-4">Receipt Submitted!</h2>
                <p className="text-gray-800 dark:text-gray-300">Your receipt is now being verified by our team. You will receive a confirmation email with your raffle code once approved. This usually takes a few hours.</p>
            </div>
        );
    }
    
    return (
        <div className="max-w-lg mx-auto bg-white/20 dark:bg-black/20 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center">
            <ion-icon name="mail-outline" className="text-blue-400 text-7xl mb-4"></ion-icon>
            <h2 className="text-3xl font-bold mb-4">Check Your Email</h2>
            <p className="text-gray-800 dark:text-gray-300 mb-6">Our payment agent will send instructions to <strong>{formData.email}</strong>. After paying, upload your receipt below.</p>
            <form onSubmit={handleSubmitReceipt} className="mt-6 p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                <h4 className="font-bold text-lg mb-4 text-center text-black dark:text-white">Upload Your Receipt</h4>
                <div className="mb-4">
                    <label htmlFor="receipt-upload" className="block w-full cursor-pointer bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-byd-red dark:hover:border-byd-red">
                        {receiptFile ? (
                            <span className="text-green-500">{receiptFile.name}</span>
                        ) : (
                            <span className="text-gray-500 dark:text-gray-400">Click to select a file</span>
                        )}
                        <input id="receipt-upload" type="file" className="hidden" onChange={handleReceiptFileChange} accept="image/*,.pdf" required />
                    </label>
                </div>
                <button type="submit" disabled={isProcessing || !receiptFile} className="w-full bg-byd-red text-white py-3 px-8 rounded-full font-semibold hover:bg-byd-red-dark transition-colors disabled:bg-gray-500">
                    {isProcessing ? 'Submitting...' : 'Submit Receipt'}
                </button>
            </form>
        </div>
    );
  };


  const renderSuccessStep = () => (
    <div className="max-w-lg mx-auto bg-white/20 dark:bg-black/20 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center">
      <div className="text-6xl mb-4 text-byd-red"><i className="bi bi-trophy-fill"></i></div>
      <h2 className="text-3xl font-bold text-byd-red mb-4">Entry Confirmed!</h2>
      <p className="text-lg text-gray-800 dark:text-gray-200 mb-6">Thank you for participating! Here is your unique raffle code. Keep this safe!</p>
      <div className="bg-black/50 border-2 border-dashed border-byd-red py-4 px-6 rounded-lg mb-6">
        <p className="text-lg text-gray-300">Your raffle code:</p>
        <p className="text-3xl font-bold tracking-widest text-white">{currentEntry?.raffle_code}</p>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-400">A confirmation email has been sent to {formData.email}.</p>
    </div>
  );

  const renderContent = () => {
    switch (step) {
      case 'FORM': return renderFormStep();
      case 'PAYMENT': return renderPaymentStep();
      case 'AWAITING_RECEIPT': return renderAwaitingReceiptStep();
      case 'SUCCESS': return renderSuccessStep();
      default: return renderFormStep();
    }
  };


  if (isLoading || !content?.homepage) {
    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="text-byd-red text-2xl">Loading Giveaway...</div>
        </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Image - BYD HAN EV */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://i.ibb.co/vvRThLL/han.jpg)',
          }}
        />
        
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Premium Content Overlay */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 text-center">
          
          {/* Main Headline */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-black mb-4 sm:mb-6 tracking-tighter drop-shadow-2xl">
            BLACK FRIDAY BYD
          </h1>
          
          {/* General Offer */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 tracking-tight drop-shadow-lg px-4">
            UNLOCK UNBELIEVABLE SAVINGS ON THE ENTIRE HAN EV LINE!<br />
            <span className="text-byd-red">UP TO ¥{DISCOUNT_AMOUNT.toLocaleString()} OFF!</span>
          </h2>
          
          {/* Model Name */}
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-black text-black mb-8 sm:mb-10 tracking-wider drop-shadow-xl">
            BYD HAN EV
          </h3>
          
          {/* Price Block */}
          <div className="mb-8 sm:mb-12">
            <p className="text-xl sm:text-2xl md:text-3xl text-white font-semibold mb-2 line-through opacity-80">
              WAS ¥{ORIGINAL_PRICE.toLocaleString()}
            </p>
            <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl mb-2">
              NOW JUST <span className="text-byd-red">¥{HAN_EV_PRICE.toLocaleString()}</span>
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium">
              STARTING AT THIS INCREDIBLE PRICE
            </p>
          </div>
          
          {/* Call to Action Button */}
          <button
            onClick={() => setCurrentPage('Login')}
            className="px-12 sm:px-16 md:px-20 py-5 sm:py-6 md:py-7 text-xl sm:text-2xl md:text-3xl font-black text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider border-4 border-white"
          >
            BOOK A TEST DRIVE
          </button>
          
          {/* Login prompt */}
          <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-white/90 font-semibold drop-shadow-lg">
            Login or Sign Up to Book Your Test Drive
          </p>
          
        </div>
        
        {/* Small Footnotes */}
        <div className="absolute bottom-4 left-0 right-0 px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs sm:text-sm text-white/80 z-10">
          <p className="drop-shadow-md">Terms and conditions apply. Promotion not combinable with other offers.</p>
          <p className="drop-shadow-md">Prices valid on Snow White models only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image - BYD HAN EV */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(https://i.ibb.co/vvRThLL/han.jpg)',
        }}
      />
      
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Premium Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 text-center">
        
        {/* Main Headline */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-black mb-4 sm:mb-6 tracking-tighter drop-shadow-2xl">
          BLACK FRIDAY BYD
        </h1>
        
        {/* General Offer */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 tracking-tight drop-shadow-lg px-4">
          UNLOCK UNBELIEVABLE SAVINGS ON THE ENTIRE HAN EV LINE!<br />
          <span className="text-byd-red">UP TO ¥{DISCOUNT_AMOUNT.toLocaleString()} OFF!</span>
        </h2>
        
        {/* Model Name */}
        <h3 className="text-4xl sm:text-5xl md:text-6xl font-black text-black mb-8 sm:mb-10 tracking-wider drop-shadow-xl">
          BYD HAN EV
        </h3>
        
        {/* Price Block */}
        <div className="mb-8 sm:mb-12">
          <p className="text-xl sm:text-2xl md:text-3xl text-white font-semibold mb-2 line-through opacity-80">
            WAS ¥{ORIGINAL_PRICE.toLocaleString()}
          </p>
          <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl mb-2">
            NOW JUST <span className="text-byd-red">¥{HAN_EV_PRICE.toLocaleString()}</span>
          </p>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium">
            STARTING AT THIS INCREDIBLE PRICE
          </p>
        </div>
        
        {/* Call to Action Button */}
        <button
          onClick={() => setCurrentPage('VehicleDetail')}
          className="px-12 sm:px-16 md:px-20 py-5 sm:py-6 md:py-7 text-xl sm:text-2xl md:text-3xl font-black text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider border-4 border-white"
        >
          BOOK A TEST DRIVE
        </button>
        
        {/* User greeting */}
        <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-white/90 font-semibold drop-shadow-lg">
          Welcome, {currentUser.name}! Book Your Exclusive Test Drive Now
        </p>
        
      </div>
      
      {/* Small Footnotes */}
      <div className="absolute bottom-4 left-0 right-0 px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs sm:text-sm text-white/80 z-10">
        <p className="drop-shadow-md">Terms and conditions apply. Promotion not combinable with other offers.</p>
        <p className="drop-shadow-md">Prices valid on Snow White models only.</p>
      </div>
    </div>
  );
};

export default GiveawayPage;