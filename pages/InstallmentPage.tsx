

import React, { useState, useMemo } from 'react';
// FIX: Import Page from types.ts to break circular dependency.
import { Vehicle, Page } from '../types';
import { sendInstallmentConfirmation } from '../services/emailService';

interface InstallmentPageProps {
  vehicle: Vehicle | null;
  setCurrentPage: (page: Page) => void;
}

const InstallmentPage: React.FC<InstallmentPageProps> = ({ vehicle, setCurrentPage }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Confirmation, 3: Success
  
  // Form State
  const [downPayment, setDownPayment] = useState(vehicle ? (vehicle.price * 0.2).toString() : '50000');
  const [loanTerm, setLoanTerm] = useState('36'); // in months
  const [interestRate] = useState(4.5); // Annual interest rate in percent
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  
  const { monthlyPayment, principal } = useMemo(() => {
    if (!vehicle) return { monthlyPayment: 0, principal: 0 };
    const P = vehicle.price - parseFloat(downPayment); // Principal loan amount
    if (P <= 0) return { monthlyPayment: 0, principal: 0 };

    const r = (interestRate / 100) / 12; // Monthly interest rate
    const n = parseInt(loanTerm); // Number of months
    
    if (r === 0) return { monthlyPayment: P / n, principal: P };
    
    const M = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return { monthlyPayment: M, principal: P };
  }, [vehicle, downPayment, loanTerm, interestRate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && email) {
        setStep(2);
    }
  }

  const handleConfirm = async () => {
    if (!vehicle) return;
    // Simulate API calls to Supabase and Stripe
    await sendInstallmentConfirmation(email, {
        name: fullName,
        vehicleName: vehicle.name,
        monthlyPayment,
        loanTerm,
    });
    setStep(3);
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-md mx-auto bg-gray-100 dark:bg-gray-900 p-8 rounded-xl shadow-lg">
          {/* Fix: Replaced 'class' with 'className' for the ion-icon custom element. */}
          <ion-icon name="car-sport-outline" className="text-byd-red text-6xl mb-4"></ion-icon>
          <h1 className="text-3xl font-bold mb-4">No Vehicle Selected</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Please choose a vehicle from our lineup to start your financing application.</p>
          <button
            onClick={() => setCurrentPage('Vehicles')}
            className="bg-byd-red text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-byd-red-dark transition-colors duration-300"
          >
            Explore Vehicles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
            {step === 1 && (
                 <h1 className="text-5xl font-extrabold text-center mb-4">Financing Application</h1>
            )}
            {step === 2 && (
                 <h1 className="text-5xl font-extrabold text-center mb-4">Confirm Your Application</h1>
            )}
             {step === 3 && (
                 <h1 className="text-5xl font-extrabold text-center mb-4">Application Successful!</h1>
            )}
            <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
                You're one step closer to owning your new {vehicle.name}.
            </p>
        </div>

        {/* Step 1: Form */}
        {step === 1 && (
          <form onSubmit={handleSubmit}>
            <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-lg flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2 space-y-6">
                <h2 className="text-2xl font-bold border-b border-gray-200 dark:border-gray-700 pb-2">1. Your Selected Vehicle</h2>
                <div className="flex items-center gap-4">
                    <img src={vehicle.imageUrl} alt={vehicle.name} className="w-24 h-24 object-cover rounded-lg"/>
                    <div>
                        <h3 className="text-xl font-bold">{vehicle.name}</h3>
                        <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">¥{vehicle.price.toLocaleString()}</p>
                    </div>
                </div>
                <h2 className="text-2xl font-bold border-b border-gray-200 dark:border-gray-700 pb-2 pt-4">2. Financing Details</h2>
                 <div>
                    <label htmlFor="downPayment" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Down Payment (¥{parseFloat(downPayment).toLocaleString()})</label>
                    <input 
                        type="range" 
                        id="downPayment"
                        min={vehicle.price * 0.1}
                        max={vehicle.price * 0.8}
                        step="1000"
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div>
                    <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Loan Term</label>
                    <select id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md focus:ring-byd-red focus:border-byd-red">
                        <option value="12">12 Months</option>
                        <option value="24">24 Months</option>
                        <option value="36">36 Months</option>
                        <option value="48">48 Months</option>
                        <option value="60">60 Months</option>
                    </select>
                </div>
                <h2 className="text-2xl font-bold border-b border-gray-200 dark:border-gray-700 pb-2 pt-4">3. Personal Information</h2>
                 <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Full Name</label>
                    <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required className="mt-1 block w-full p-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md focus:ring-byd-red focus:border-byd-red"/>
                </div>
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Email Address</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full p-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md focus:ring-byd-red focus:border-byd-red"/>
                </div>
              </div>

              <div className="lg:w-1/2 bg-white/50 dark:bg-black/50 p-8 rounded-lg flex flex-col justify-center items-center text-center">
                <p className="text-lg text-gray-600 dark:text-gray-300">Est. Monthly Payment</p>
                <p className="text-5xl font-bold my-2 text-byd-red">¥{monthlyPayment.toFixed(2)}</p>
                <p className="text-gray-500 dark:text-gray-400">for {loanTerm} months</p>
                <div className="text-left w-full mt-6 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Total Price:</span> <span>¥{vehicle.price.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Down Payment:</span> <span>- ¥{parseFloat(downPayment).toLocaleString()}</span></div>
                    <div className="flex justify-between border-t border-gray-300 dark:border-gray-600 pt-2 font-bold"><span className="text-gray-500 dark:text-gray-400">Loan Amount:</span> <span>¥{principal.toLocaleString()}</span></div>
                </div>
                <button type="submit" className="mt-8 w-full bg-byd-red text-white py-3 px-8 rounded-full font-semibold hover:bg-byd-red-dark transition-colors duration-300">
                    Submit Application
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && (
             <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-6">Please Review Your Details</h2>
                <div className="space-y-4 text-left border-t border-b border-gray-200 dark:border-gray-700 py-6">
                    <p><strong>Applicant:</strong> {fullName} ({email})</p>
                    <p><strong>Vehicle:</strong> {vehicle.name}</p>
                    <p><strong>Total Price:</strong> ¥{vehicle.price.toLocaleString()}</p>
                    <p><strong>Down Payment:</strong> ¥{parseFloat(downPayment).toLocaleString()}</p>
                    <p><strong>Loan Amount:</strong> ¥{principal.toLocaleString()}</p>
                    <p><strong>Loan Term:</strong> {loanTerm} Months</p>
                    <p className="text-2xl font-bold text-byd-red"><strong>Monthly Payment:</strong> ¥{monthlyPayment.toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 my-6">
                    By clicking 'Confirm & Pay Deposit', you agree to our financing terms. We will redirect you to Stripe to securely process your deposit payment of ¥{parseFloat(downPayment).toLocaleString()}.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => setStep(1)} className="w-full bg-gray-600 text-white dark:bg-gray-700 dark:text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-500 dark:hover:bg-gray-600 transition-colors">
                        Go Back & Edit
                    </button>
                    <button onClick={handleConfirm} className="w-full bg-byd-red text-white py-3 px-8 rounded-full font-semibold hover:bg-byd-red-dark transition-colors">
                        Confirm & Pay Deposit
                    </button>
                </div>
             </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
            <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-lg text-center">
                {/* Fix: Replaced 'class' with 'className' for the ion-icon custom element. */}
                <ion-icon name="checkmark-circle-outline" className="text-green-500 text-7xl mb-4"></ion-icon>
                <h2 className="text-3xl font-bold mb-4">Congratulations, {fullName}!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Your financing application for the {vehicle.name} has been approved and your deposit of ¥{parseFloat(downPayment).toLocaleString()} has been successfully processed.
                </p>
                <p className="mb-8">A confirmation email with your payment schedule and contract details has been sent to <strong>{email}</strong>. Our team will be in touch shortly to arrange the delivery of your new car!</p>
                <button
                    onClick={() => setCurrentPage('Home')}
                    className="bg-byd-red text-white py-3 px-8 rounded-full font-semibold hover:bg-byd-red-dark transition-colors"
                >
                    Back to Homepage
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default InstallmentPage;