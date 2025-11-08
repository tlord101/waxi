
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
