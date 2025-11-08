
import React, { useState } from 'react';
import { sendGiveawayConfirmation } from '../services/emailService';

const COUNTRIES = ["China", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "Other"];

const GiveawayPage: React.FC = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: Payment, 3: Success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'China',
  });
  const [raffleCode, setRaffleCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(async () => {
      // Generate raffle code
      const code = `BYD2025-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setRaffleCode(code);

      // Send confirmation email
      await sendGiveawayConfirmation(formData.email, { name: formData.name, raffleCode: code });
      
      setIsProcessing(false);
      setStep(3);
    }, 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderFormStep();
      case 2:
        return renderPaymentStep();
      case 3:
        return renderSuccessStep();
      default:
        return renderFormStep();
    }
  };

  const renderFormStep = () => (
    <div className="max-w-lg mx-auto bg-white/20 dark:bg-black/20 backdrop-blur-sm p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-2 text-center">Enter the Giveaway</h2>
      <p className="text-center text-gray-800 dark:text-gray-300 mb-6">Fill in your details to proceed to payment. Entry fee: $1,000 USD.</p>
      <form onSubmit={handleSubmitInfo} className="space-y-6">
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
          <input
            type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required
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
          className="w-full bg-byd-red text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-byd-red-dark transition-colors duration-300"
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="max-w-lg mx-auto bg-white/20 dark:bg-black/20 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center">
      <h2 className="text-3xl font-bold mb-4">Confirm Your Entry</h2>
      <p className="text-gray-800 dark:text-gray-300 mb-6">You are about to make a non-refundable payment of $1,000 USD to enter the BYD Dolphin giveaway.</p>
      <div className="text-left bg-black/50 p-4 rounded-lg mb-6 space-y-2 text-white">
        <p><strong>Name:</strong> {formData.name}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Country:</strong> {formData.country}</p>
      </div>
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-green-500 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-green-600 transition-colors duration-300 disabled:bg-gray-500 flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Pay $1,000 Now'
        )}
      </button>
       <button onClick={() => setStep(1)} className="mt-4 text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline">
          Go back and edit
      </button>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="max-w-lg mx-auto bg-white/20 dark:bg-black/20 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center">
      <div className="text-6xl mb-4">🎊</div>
      <h2 className="text-3xl font-bold text-byd-red mb-4">Entry Confirmed!</h2>
      <p className="text-lg text-gray-800 dark:text-gray-200 mb-6">Thank you for participating! Your payment was successful. Here is your unique raffle code. Keep this safe!</p>
      <div className="bg-black/50 border-2 border-dashed border-byd-red py-4 px-6 rounded-lg mb-6">
        <p className="text-lg text-gray-300">Your raffle code:</p>
        <p className="text-3xl font-bold tracking-widest text-white">{raffleCode}</p>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-400">A confirmation email with your code has been sent to {formData.email}. We will announce the winner after the giveaway period ends.</p>
    </div>
  );

  return (
    <div className="relative py-20 overflow-hidden min-h-[80vh] flex items-center">
      <img src="https://picsum.photos/seed/byddolphin-giveaway/1920/1080" alt="BYD Dolphin" className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-30"/>
      <div className="relative container mx-auto px-6">
        {step === 1 && <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-center">Win a Brand New BYD Dolphin!</h1>}
        <div className="mt-12">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default GiveawayPage;