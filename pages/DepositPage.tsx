import React, { useEffect, useState } from 'react';
import { User, Deposit, Page } from '../types';
import DashboardHeader from '../components/DashboardHeader';
import { getPendingDepositForUser, addDeposit, updateDeposit } from '../services/dbService';
import { sendDepositRequestToAgent, sendDepositReceiptToAgent } from '../services/emailService';
import PaymentModal from '../components/PaymentModal';

interface Props {
  user: User;
  setCurrentUser: (user: User) => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
}

const DepositPage: React.FC<Props> = ({ user, setCurrentUser, currentPage, setCurrentPage, onLogout }) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [depositError, setDepositError] = useState('');
  const [pendingDeposit, setPendingDeposit] = useState<Deposit | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);

  const checkPendingDeposit = async () => {
    const deposit = await getPendingDepositForUser(user.id);
    setPendingDeposit(deposit);
  }

  useEffect(() => {
    checkPendingDeposit();
  }, [user.id]);

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

    const newDeposit = await addDeposit({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      amount: amount,
      method: method === 'crypto' ? 'Crypto' : 'Bank Deposit',
    });
    setPendingDeposit(newDeposit);

    await sendDepositRequestToAgent({
      userName: user.name,
      userEmail: user.email,
      amount: amount,
      method: method === 'crypto' ? 'Crypto' : 'Bank Deposit',
    });

    setDepositAmount('');
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
      const fakeReceiptUrl = `https://example.com/receipts/deposits/${pendingDeposit.id}/${receiptFile.name}`;
      const updates: Partial<Deposit> = {
        status: 'Verifying',
        receipt_url: fakeReceiptUrl,
      };
      await updateDeposit(pendingDeposit.id, updates);

      await sendDepositReceiptToAgent({
        userName: user.name,
        userEmail: user.email,
        depositId: pendingDeposit.id,
        amount: pendingDeposit.amount,
        receiptUrl: fakeReceiptUrl,
      });

      setPendingDeposit({ ...pendingDeposit, ...updates });
      setReceiptFile(null);
    } catch (error) {
      alert("An error occurred while submitting your receipt. Please try again.");
      console.error("Receipt submission error:", error);
    } finally {
      setIsSubmittingReceipt(false);
    }
  };

  return (
    <div>
      <DashboardHeader currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={onLogout} title="Deposit Funds" />
      <div className="py-16 container mx-auto px-6">
        <h1 className="text-4xl font-extrabold mb-6">Deposit Funds</h1>
        <div className="animate-fade-in">
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
              <div className="bg-yellow-500/10 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-6 rounded-r-lg text-center">
                <ion-icon name="time-outline" className="text-5xl mb-2"></ion-icon>
                <h3 className="font-bold text-xl">Receipt Submitted for Verification</h3>
                <p className="mt-2">
                  We have received your receipt for the <strong>¥{pendingDeposit.amount.toLocaleString()}</strong> deposit.
                </p>
                <p>Our team is reviewing it and will credit your account shortly. This usually takes a few hours.</p>
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
    </div>
  );
};

export default DepositPage;
