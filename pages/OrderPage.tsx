
import React, { useState, useEffect } from 'react';
import { Vehicle, Order, User } from '../types';
import { Page } from '../App';
import { sendOrderConfirmation, sendPaymentRequestToAgent, sendReceiptSubmissionToAgent } from '../services/emailService';
import { addOrder, updateOrder, updateUser } from '../services/dbService';
import PaymentModal from '../components/PaymentModal';

interface OrderPageProps {
  vehicle: Vehicle | null;
  setCurrentPage: (page: Page) => void;
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  pendingOrder: Order | null;
}

const OrderPage: React.FC<OrderPageProps> = ({ vehicle, setCurrentPage, currentUser, setCurrentUser, pendingOrder }) => {
  const [step, setStep] = useState<'FORM' | 'AWAITING_PAYMENT_DETAILS' | 'UPLOAD_RECEIPT' | 'PENDING_CONFIRMATION' | 'CONFIRMED'>('FORM');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    // If there's a pending order for the user, and the currently selected vehicle matches it,
    // then we are resuming this specific pending order.
    if (pendingOrder && vehicle && pendingOrder.vehicle_id === vehicle.id) {
        setFullName(pendingOrder.customer_name);
        setEmail(pendingOrder.customer_email);
        setCurrentOrder(pendingOrder);
        setStep('UPLOAD_RECEIPT'); // Jump straight to upload step
    } else if (currentUser) {
        // This is a new order, just pre-fill user info from their profile.
        setFullName(currentUser.name);
        setEmail(currentUser.email);
        setStep('FORM'); // Ensure we start at the form
        setCurrentOrder(null); // Clear any previous order state
    }
  }, [pendingOrder, vehicle, currentUser]);


  const handleOpenPaymentModal = () => {
    if (!vehicle || !fullName || !email) return;
    setIsPaymentModalOpen(true);
  };

  const handlePayWithWallet = async () => {
    if (!vehicle || !currentUser || currentUser.balance < vehicle.price) {
        alert("Insufficient balance.");
        return;
    }
    setIsProcessing(true);

    // 1. Calculate new balance and update user in DB and state
    const newBalance = currentUser.balance - vehicle.price;
    updateUser(currentUser.id, { balance: newBalance });
    setCurrentUser({ ...currentUser, balance: newBalance });

    // 2. Create order in DB with 'Paid' status
    // Fix: Await the promise returned by addOrder
    const newOrder = await addOrder({
        userId: currentUser.id,
        customer_name: fullName,
        customer_email: email,
        vehicle_id: vehicle.id,
        vehicle_name: vehicle.name,
        total_price: vehicle.price,
        payment_status: 'Paid',
        fulfillment_status: 'Processing',
    });
    setCurrentOrder(newOrder);

    // 3. Send confirmation email
    await sendOrderConfirmation(email, {
        name: fullName,
        vehicleName: vehicle.name,
        price: vehicle.price,
    });
    
    setIsProcessing(false);
    // 4. Go to final confirmation screen
    setStep('CONFIRMED');
  };

  const handleSelectPaymentMethod = async (method: 'crypto' | 'bank') => {
    if (!vehicle) return;
    setIsPaymentModalOpen(false);
    setIsProcessing(true);

    // 1. Create a new order record in the database
    // Fix: Await the promise returned by addOrder
    const newOrder = await addOrder({
        userId: currentUser?.id,
        customer_name: fullName,
        customer_email: email,
        vehicle_id: vehicle.id,
        vehicle_name: vehicle.name,
        total_price: vehicle.price,
        payment_status: 'Awaiting Receipt',
        fulfillment_status: 'Processing',
    });
    setCurrentOrder(newOrder);

    // 2. Notify agent to send payment details to the customer
    await sendPaymentRequestToAgent({
      customerName: fullName,
      amount: vehicle.price,
      paymentMethod: method === 'crypto' ? 'Crypto' : 'Bank Deposit',
      customerEmail: email,
    });
    
    setIsProcessing(false);
    // 3. Move user to the next step
    setStep('AWAITING_PAYMENT_DETAILS');
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleSubmitReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile || !currentOrder) {
      alert("Please select a receipt file to upload.");
      return;
    }
    setIsProcessing(true);

    // 1. Simulate file upload and get a URL
    const fakeReceiptUrl = `https://example.com/receipts/${currentOrder.id}/${receiptFile.name}`;

    // 2. Update order status in the database
    updateOrder(currentOrder.id, {
        payment_status: 'Verifying',
        receipt_url: fakeReceiptUrl,
    });
    
    // 3. Notify agent that receipt has been submitted for verification
    await sendReceiptSubmissionToAgent({
        customerName: fullName,
        customerEmail: email,
        orderId: currentOrder.id,
        vehicleName: vehicle!.name,
        receiptUrl: fakeReceiptUrl,
    });
    
    setIsProcessing(false);
    // 4. Move user to the final waiting step
    setStep('PENDING_CONFIRMATION');
  };

  if (!vehicle) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-md mx-auto bg-gray-100 dark:bg-gray-900 p-8 rounded-xl shadow-lg">
          {/* Fix: Replaced 'class' with 'className' for the ion-icon custom element. */}
          <ion-icon name="car-sport-outline" className="text-byd-red text-6xl mb-4"></ion-icon>
          <h1 className="text-3xl font-bold mb-4">No Vehicle Selected for Purchase</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Please choose a vehicle from our lineup to begin the purchase process.</p>
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

  // Safeguard: User must be logged in to access the order page.
  if (!currentUser) {
    return (
        <div className="container mx-auto px-6 py-20 text-center">
            <div className="max-w-md mx-auto bg-gray-100 dark:bg-gray-900 p-8 rounded-xl shadow-lg">
                {/* Fix: Replaced 'class' with 'className' for the ion-icon custom element. */}
                <ion-icon name="log-in-outline" className="text-byd-red text-6xl mb-4"></ion-icon>
                <h1 className="text-3xl font-bold mb-4">Login Required</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">You must be logged in to make a purchase.</p>
                <button
                    onClick={() => setCurrentPage('Login')}
                    className="bg-byd-red text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-byd-red-dark transition-colors duration-300"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
  }

  const renderContent = () => {
    switch (step) {
      case 'FORM':
        const canAfford = currentUser.balance >= vehicle.price;
        return (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-lg flex flex-col lg:flex-row gap-8">
              {/* Vehicle Summary */}
              <div className="lg:w-1/2">
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Order Summary</h2>
                <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-64 object-cover rounded-lg mb-4"/>
                <h3 className="text-3xl font-bold">{vehicle.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{vehicle.type}</p>
                <div className="text-4xl font-extrabold">¥{vehicle.price.toLocaleString()}</div>
              </div>
              
              {/* User Info & Payment */}
              <div className="lg:w-1/2 space-y-6 flex flex-col justify-center">
                <h2 className="text-2xl font-bold border-b border-gray-200 dark:border-gray-700 pb-2">Your Information</h2>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Full Name</label>
                  <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required disabled className="mt-1 block w-full p-3 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-byd-red focus:border-byd-red disabled:bg-gray-200 dark:disabled:bg-gray-800"/>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Email Address</label>
                  <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required disabled className="mt-1 block w-full p-3 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-byd-red focus:border-byd-red disabled:bg-gray-200 dark:disabled:bg-gray-800"/>
                </div>

                <h2 className="text-2xl font-bold border-b border-gray-200 dark:border-gray-700 pb-2 pt-6">Payment Method</h2>
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center">
                    <p className="text-sm text-blue-700 dark:text-blue-300">Your current wallet balance is <strong>¥{currentUser.balance.toLocaleString()}</strong></p>
                </div>

                {canAfford ? (
                    <div className="space-y-3">
                        <button type="button" onClick={handlePayWithWallet} disabled={isProcessing} className="w-full bg-green-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors duration-300 disabled:bg-gray-500 flex items-center justify-center gap-2">
                            <ion-icon name="wallet-outline"></ion-icon>
                            {isProcessing ? 'Processing...' : `Pay ¥${vehicle.price.toLocaleString()} with Wallet`}
                        </button>
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                            <span>or, </span>
                            <button type="button" onClick={handleOpenPaymentModal} className="font-medium text-byd-red hover:underline">
                                use other payment methods.
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-lg text-center">
                            <p className="font-bold">Insufficient Funds</p>
                            <p className="text-sm">Your wallet balance is too low for this purchase.</p>
                        </div>
                        <button type="button" onClick={handleOpenPaymentModal} disabled={isProcessing} className="w-full bg-byd-red text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-byd-red-dark transition-colors duration-300 disabled:bg-gray-500">
                            {isProcessing ? 'Processing...' : 'Pay with Agent (Bank/Crypto)'}
                        </button>
                    </div>
                )}
              </div>
            </div>
          </form>
        );
      
      case 'AWAITING_PAYMENT_DETAILS':
        return (
            <div className="max-w-2xl mx-auto bg-gray-100 dark:bg-gray-900 p-8 rounded-xl shadow-lg text-center">
                {/* FIX: Replaced 'class' with 'className' to conform to React standards */}
                <ion-icon name="mail-outline" className="text-blue-500 text-7xl mb-4"></ion-icon>
                <h2 className="text-3xl font-bold mb-4">Check Your Email!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Our payment agent has been notified. They will send an email to <strong>{email}</strong> shortly with instructions on how to complete your payment.</p>
                <p className="mb-8">Once you have made the payment, please return to this page to upload your proof of payment.</p>
                <button onClick={() => setStep('UPLOAD_RECEIPT')} className="bg-byd-red text-white py-3 px-8 rounded-full font-semibold hover:bg-byd-red-dark transition-colors">
                    I've Paid, Upload Receipt
                </button>
            </div>
        );
        
      case 'UPLOAD_RECEIPT':
        return (
            <form onSubmit={handleSubmitReceipt} className="max-w-2xl mx-auto bg-gray-100 dark:bg-gray-900 p-8 rounded-xl shadow-lg text-center">
                {/* FIX: Replaced 'class' with 'className' to conform to React standards */}
                <ion-icon name="cloud-upload-outline" className="text-byd-red text-7xl mb-4"></ion-icon>
                <h2 className="text-3xl font-bold mb-4">Upload Payment Receipt</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Please upload a clear image or PDF of your payment receipt for order <strong>{currentOrder?.id}</strong> to confirm your purchase.</p>
                <div className="mb-6">
                    <label htmlFor="receipt-upload" className="block w-full cursor-pointer bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-byd-red dark:hover:border-byd-red">
                        {receiptFile ? (
                            <span className="text-green-500">{receiptFile.name}</span>
                        ) : (
                            <span className="text-gray-500 dark:text-gray-400">Click to select a file</span>
                        )}
                        <input id="receipt-upload" type="file" className="hidden" onChange={handleReceiptFileChange} accept="image/*,.pdf" required />
                    </label>
                </div>
                <button type="submit" disabled={isProcessing || !receiptFile} className="w-full bg-byd-red text-white py-3 px-8 rounded-full font-semibold hover:bg-byd-red-dark transition-colors disabled:bg-gray-500">
                    {isProcessing ? 'Submitting...' : 'Submit Receipt for Verification'}
                </button>
            </form>
        );

      case 'PENDING_CONFIRMATION':
        return (
            <div className="max-w-2xl mx-auto bg-gray-100 dark:bg-gray-900 p-8 rounded-xl shadow-lg text-center">
                {/* FIX: Replaced 'class' with 'className' to conform to React standards */}
                <ion-icon name="time-outline" className="text-yellow-500 text-7xl mb-4"></ion-icon>
                <h2 className="text-3xl font-bold mb-4">Receipt Submitted!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Thank you! We have received your payment receipt. Our agent is now verifying the transaction.</p>
                <p className="mb-8">You will receive a final order confirmation email at <strong>{email}</strong> once the payment is approved. This usually takes a few hours.</p>
                 <button onClick={() => setCurrentPage('Home')} className="bg-gray-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-500 transition-colors">
                    Back to Homepage
                </button>
            </div>
        );

      case 'CONFIRMED':
        return (
            <div className="max-w-2xl mx-auto bg-gray-100 dark:bg-gray-900 p-8 rounded-xl shadow-lg text-center">
                {/* FIX: Replaced 'class' with 'className' to conform to React standards */}
                <ion-icon name="checkmark-circle-outline" className="text-green-500 text-7xl mb-4"></ion-icon>
                <h1 className="text-3xl font-bold mb-4">Thank You For Your Order, {fullName}!</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Your purchase of the {vehicle.name} is complete. A confirmation email has been sent to <strong>{email}</strong>.</p>
                <p className="mb-8">Our sales team will contact you within 24 hours to arrange for delivery and final paperwork. Welcome to the BYD family!</p>
                <button onClick={() => setCurrentPage('Home')} className="bg-byd-red text-white py-3 px-8 rounded-full font-semibold hover:bg-byd-red-dark transition-colors">
                    Back to Homepage
                </button>
            </div>
        );
    }
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-5xl font-extrabold mb-4">Complete Your Purchase</h1>
            <p className="text-gray-600 dark:text-gray-300">
              You're just a few steps away from owning the incredible {vehicle.name}.
            </p>
        </div>
        {renderContent()}
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSelectPayment={handleSelectPaymentMethod}
      />
    </div>
  );
};

export default OrderPage;
