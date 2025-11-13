// FIX: Moved Page and Theme types here to break circular dependency between App.tsx and other files.
export type Page = 'Home' | 'Vehicles' | 'Installment' | 'Giveaway' | 'About' | 'Contact' | 'Order' | 'Admin' | 'Login' | 'Signup' | 'Dashboard';
export type Theme = 'dark' | 'light';
export type Language = 'en' | 'zh' | 'es';

export const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文 (Chinese)' },
  { code: 'es', name: 'Español (Spanish)' },
];


export interface Vehicle {
  id: string; // Use string for Firestore document IDs
  name: string;
  type: 'Sedan' | 'SUV' | 'Hatchback' | 'Commercial' | 'Special';
  price: number;
  description: string;
  imageUrl: string;
  specs: {
    icon: string;
    name: string;
    value: string;
  }[];
}

export interface User {
  id: string; // Firebase UID
  name: string;
  email: string;
  balance: number;
}

export interface EmailLog {
  id: string;
  sent_at?: Date | string;
  email_type: 'order_confirmation' | 'installment_confirmation' | 'giveaway_confirmation' | 'giveaway_winner' | 'payment_request_agent' | 'payment_receipt_agent' | 'deposit_request_agent';
  recipient: string;
  subject: string;
  body: string;
  status: 'sent' | 'failed';
}

export interface Order {
    id: string;
    userId?: string;
    customer_name: string;
    customer_email: string;
    vehicle_name: string;
    vehicle_id: string;
    total_price: number;
    order_date: string;
    payment_status: 'Pending' | 'Awaiting Receipt' | 'Verifying' | 'Paid' | 'Failed';
    fulfillment_status: 'Processing' | 'Delivered' | 'Cancelled';
    receipt_url?: string;
}

export interface InstallmentPlan {
    id: string;
    customer_name: string;
    vehicle_name: string;
    total_price: number;
    down_payment: number;
    monthly_payment: number;
    term_months: number;
    start_date: string;
    status: 'Active' | 'Paid Off';
}

export interface GiveawayEntry {
    id: string;
    name: string;
    email: string;
    country: string;
    raffle_code: string;
    payment_status: 'Paid';
    winner_status: 'No' | 'Yes';
}

export interface Investment {
  id: string;
  userId: string;
  amount: number;
  description: string;
  date: string;
}

export interface Deposit {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  method: 'Bank Deposit' | 'Crypto';
  status: 'Pending' | 'Completed' | 'Failed';
  request_date: string;
}
