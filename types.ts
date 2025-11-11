// Fix: Import React to make it available for the global JSX declaration below.
import React from 'react';

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
  email_type: 'order_confirmation' | 'installment_confirmation' | 'giveaway_confirmation' | 'giveaway_winner' | 'payment_request_agent' | 'payment_receipt_agent';
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
// Fix: Add global declaration for ion-icon. In React, JSX should use 'className' for CSS classes.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name: string;
      };
    }
  }
}