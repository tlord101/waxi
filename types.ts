// FIX: Moved Page and Theme types here to break circular dependency between App.tsx and other files.
export type Page = 'Home' | 'Vehicles' | 'Installment' | 'Giveaway' | 'About' | 'Contact' | 'Order' | 'Admin' | 'Login' | 'Signup' | 'Dashboard' | 'VehicleDetail' | 'Wallet' | 'Investments' | 'Purchases' | 'Deposit';
export type Theme = 'dark' | 'light';

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
  interiors?: {
    imageUrl: string;
    title?: string;
    description?: string;
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
  email_type: 'order_confirmation' | 'installment_confirmation' | 'giveaway_confirmation' | 'giveaway_winner' | 'payment_request_agent' | 'payment_receipt_agent' | 'deposit_request_agent' | 'deposit_receipt_agent' | 'giveaway_payment_request_agent' | 'giveaway_payment_receipt_agent';
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
    userId?: string;
    name: string;
    email: string;
    country: string;
    raffle_code: string;
    payment_status: 'Paid' | 'Awaiting Receipt' | 'Verifying' | 'Pending';
    winner_status: 'No' | 'Yes';
    receipt_url?: string;
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
  status: 'Awaiting Receipt' | 'Verifying' | 'Completed' | 'Failed';
  request_date: string;
  receipt_url?: string;
}

// --- Live Chat Types ---

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: any; // Firestore Timestamp
}

export interface ChatSession {
  id: string;
  userId?: string; // if logged in
  userName: string;
  userEmail: string;
  status: 'open' | 'closed';
  createdAt: any; // Firestore Timestamp
  lastMessage?: string;
  agentId?: string;
  agentName?: string;
  unreadByAgent: boolean;
}


// --- Site Content Management Types ---

export interface HomePageContent {
  giveaway_bg_image_url: string;
  giveaway_title: string;
  giveaway_description: string;
  giveaway_button_text: string;
  about_image_url: string;
  about_title: string;
  about_text: string;
  about_button_link_text: string;
}

export interface FooterContent {
  privacy_link_text: string;
  cookie_link_text: string;
  contact_link_text: string;
  follow_us_text: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  tiktok_url: string;
  youtube_url: string;
  copyright_text: string;
}

export interface AboutPageContent {
  banner_image_url: string;
  banner_title: string;
  banner_subtitle: string;
  main_title: string;
  main_content: string; // Using a single string for simplicity, can be formatted with newlines.
  contact_title: string;
  contact_address: string;
  contact_email: string;
  contact_phone: string;
}

export interface PaymentSettings {
  car_purchase: {
    wallet_enabled: boolean;
    agent_enabled: boolean;
  };
  giveaway: {
    wallet_enabled: boolean;
    agent_enabled: boolean;
    fee_cny: number;
  };
  investment: {
    wallet_enabled: boolean;
    agent_enabled: boolean;
  };
}

export interface SiteContent {
  logo_url: string;
  homepage: HomePageContent;
  footer: FooterContent;
  aboutpage: AboutPageContent;
  paymentSettings: PaymentSettings;
}