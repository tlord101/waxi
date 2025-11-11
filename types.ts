

// Fix: Import React to make it available for the global JSX declaration below.
import React from 'react';

export interface Vehicle {
  id: number;
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
  id: number;
  name: string;
  email: string;
  password_hash: string; // In-memory "hash"
  balance: number;
}

export interface EmailLog {
  id: number;
  sent_at?: Date | string;
  email_type: 'order_confirmation' | 'installment_confirmation' | 'giveaway_confirmation' | 'giveaway_winner' | 'payment_request_agent' | 'payment_receipt_agent';
  recipient: string;
  subject: string;
  body: string;
  status: 'sent' | 'failed';
}

export interface Order {
    id: string;
    userId?: number;
    customer_name: string;
    customer_email: string;
    vehicle_name: string;
    vehicle_id: number;
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
    id: number;
    name: string;
    email: string;
    country: string;
    raffle_code: string;
    payment_status: 'Paid';
    winner_status: 'No' | 'Yes';
}

export interface Investment {
  id: number;
  userId: number;
  amount: number;
  description: string;
  date: string;
}
// Fix: Add global declaration for ion-icon to be recognized by TypeScript in JSX.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { name: string; }, HTMLElement>;
    }
  }
}