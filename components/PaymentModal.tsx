

import React from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPayment: (method: 'crypto' | 'bank') => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSelectPayment }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div 
        className="bg-black text-white rounded-xl shadow-2xl max-w-md w-full p-8 border border-gray-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex items-center gap-3 mb-4">
          {/* Fix: Replaced 'class' with 'className' for the ion-icon custom element. */}
          <ion-icon name="lock-closed-outline" className="text-2xl"></ion-icon>
          <h2 id="payment-modal-title" className="text-2xl font-bold">Secure Payment Notice</h2>
        </div>
        
        <div className="space-y-4 text-gray-300 text-sm">
            <p>To ensure safe and verified transactions, all payments are processed through BYD's authorized payment agent.</p>
            <p>When you select a payment method below, you will be automatically directed to the agent to complete your payment.</p>
            <p>Once your payment is confirmed by the BYD payment agent, it will automatically reflect in your account on this website.</p>
        </div>

        <div className="mt-8">
            <h3 className="font-semibold mb-4">Choose your preferred payment option:</h3>
            <ul className="space-y-3">
                <li>
                    <button 
                        onClick={() => onSelectPayment('bank')}
                        className="w-full flex items-center gap-3 text-left p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                        <span className="text-2xl">💰</span>
                        <span>Pay with Bank Deposit</span>
                    </button>
                </li>
                 <li>
                    <button
                        onClick={() => onSelectPayment('crypto')}
                        className="w-full flex items-center gap-3 text-left p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                        <span className="text-2xl">💎</span>
                        <span>Pay with Crypto <span className="text-gray-400 text-xs">(We Accept Crypto Payments)</span></span>
                    </button>
                </li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;