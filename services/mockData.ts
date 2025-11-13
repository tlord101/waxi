import { Vehicle, Order, InstallmentPlan, GiveawayEntry, EmailLog, Investment, User, Deposit } from '../types';

export const mockVehicles: Vehicle[] = [
  {
    id: 'seal-01',
    name: 'BYD Seal',
    type: 'Sedan',
    price: 212800,
    description: 'A dynamic and elegant all-electric sedan with cutting-edge Blade Battery technology.',
    imageUrl: 'https://picsum.photos/seed/byd-seal/800/600',
    specs: [
      { icon: 'flash-outline', name: 'Range', value: '700 km' },
      { icon: 'rocket-outline', name: '0-100km/h', value: '3.8s' },
      { icon: 'battery-charging-outline', name: 'Battery', value: '82.5 kWh' },
      { icon: 'car-sport-outline', name: 'Drive', value: 'AWD' },
    ],
  },
  {
    id: 'tang-01',
    name: 'BYD Tang EV',
    type: 'SUV',
    price: 289800,
    description: 'A spacious and powerful 7-seater electric SUV, perfect for families and adventures.',
    imageUrl: 'https://picsum.photos/seed/byd-tang/800/600',
    specs: [
      { icon: 'flash-outline', name: 'Range', value: '505 km' },
      { icon: 'rocket-outline', name: '0-100km/h', value: '4.4s' },
      { icon: 'battery-charging-outline', name: 'Battery', value: '86.4 kWh' },
      { icon: 'people-outline', name: 'Seating', value: '7' },
    ],
  },
  {
    id: 'dolphin-01',
    name: 'BYD Dolphin',
    type: 'Hatchback',
    price: 116800,
    description: 'A nimble and stylish compact EV, designed for efficient and fun city driving.',
    imageUrl: 'https://picsum.photos/seed/byd-dolphin/800/600',
    specs: [
      { icon: 'flash-outline', name: 'Range', value: '420 km' },
      { icon: 'rocket-outline', name: '0-100km/h', value: '7.5s' },
      { icon: 'battery-charging-outline', name: 'Battery', value: '44.9 kWh' },
      { icon: 'color-palette-outline', name: 'Colors', value: '5+' },
    ],
  },
  {
    id: 'han-01',
    name: 'BYD Han EV',
    type: 'Sedan',
    price: 239800,
    description: 'A luxurious flagship sedan that combines breathtaking performance with sophisticated design.',
    imageUrl: 'https://picsum.photos/seed/byd-han/800/600',
    specs: [
      { icon: 'flash-outline', name: 'Range', value: '605 km' },
      { icon: 'rocket-outline', name: '0-100km/h', value: '3.9s' },
      { icon: 'battery-charging-outline', name: 'Battery', value: '76.9 kWh' },
      { icon: 'shield-checkmark-outline', name: 'Safety', value: '5-Star' },
    ],
  },
  {
    id: 'yuan-plus-01',
    name: 'BYD Yuan Plus (Atto 3)',
    type: 'SUV',
    price: 139800,
    description: 'A compact and modern SUV with a unique interior design and excellent efficiency.',
    imageUrl: 'https://picsum.photos/seed/byd-atto3/800/600',
    specs: [
      { icon: 'flash-outline', name: 'Range', value: '510 km' },
      { icon: 'rocket-outline', name: '0-100km/h', value: '7.3s' },
      { icon: 'battery-charging-outline', name: 'Battery', value: '60.5 kWh' },
      { icon: 'leaf-outline', name: 'Platform', value: 'e-Platform 3.0' },
    ],
  },
  {
    id: 'ebus-01',
    name: 'BYD eBus',
    type: 'Commercial',
    price: 1200000,
    description: 'A reliable and zero-emission electric bus solution for modern public transport.',
    imageUrl: 'https://picsum.photos/seed/byd-ebus/800/600',
    specs: [
        { icon: 'flash-outline', name: 'Range', value: '250 km' },
        { icon: 'people-outline', name: 'Capacity', value: '90' },
        { icon: 'battery-charging-outline', name: 'Battery', value: '324 kWh' },
        { icon: 'construct-outline', name: 'Length', value: '12m' },
    ],
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    userId: 'mock-user-1',
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    vehicle_name: 'BYD Seal',
    vehicle_id: 'seal-01',
    total_price: 212800,
    order_date: '2025-06-15',
    payment_status: 'Paid',
    fulfillment_status: 'Delivered',
  },
  {
    id: 'ord-002',
    userId: 'mock-user-2',
    customer_name: 'Jane Smith',
    customer_email: 'jane@example.com',
    vehicle_name: 'BYD Tang EV',
    vehicle_id: 'tang-01',
    total_price: 289800,
    order_date: '2025-06-20',
    payment_status: 'Verifying',
    fulfillment_status: 'Processing',
    receipt_url: 'https://example.com/receipt.pdf',
  },
  {
    id: 'ord-003',
    userId: 'mock-user-3',
    customer_name: 'Test User',
    customer_email: 'test@example.com',
    vehicle_name: 'BYD Dolphin',
    vehicle_id: 'dolphin-01',
    total_price: 116800,
    order_date: '2025-07-01',
    payment_status: 'Awaiting Receipt',
    fulfillment_status: 'Processing',
  },
];

export const mockInstallmentPlans: InstallmentPlan[] = [
    {
        id: 'inst-01',
        customer_name: 'Alice Johnson',
        vehicle_name: 'BYD Han EV',
        total_price: 239800,
        down_payment: 50000,
        monthly_payment: 5500,
        term_months: 36,
        start_date: '2025-05-10',
        status: 'Active',
    },
    {
        id: 'inst-02',
        customer_name: 'Bob Williams',
        vehicle_name: 'BYD Yuan Plus (Atto 3)',
        total_price: 139800,
        down_payment: 30000,
        monthly_payment: 2300,
        term_months: 48,
        start_date: '2024-01-15',
        status: 'Paid Off',
    }
];

export const mockGiveawayEntries: GiveawayEntry[] = [
    {
        id: 'give-01',
        name: 'Carlos Ray',
        email: 'carlos@example.com',
        country: 'United States',
        raffle_code: 'BYD2025-ABCD',
        payment_status: 'Paid',
        winner_status: 'No',
    },
    {
        id: 'give-02',
        name: 'Yuki Tanaka',
        email: 'yuki@example.com',
        country: 'Japan',
        raffle_code: 'BYD2025-EFGH',
        payment_status: 'Paid',
        winner_status: 'No',
    }
];

export const mockEmailLogs: EmailLog[] = [
    {
        id: 'log-01',
        sent_at: new Date('2025-06-15T10:00:00Z').toISOString(),
        email_type: 'order_confirmation',
        recipient: 'john@example.com',
        subject: 'Your BYD Seal Order is Confirmed!',
        body: '<p>Dear John Doe, ...</p>',
        status: 'sent',
    },
    {
        id: 'log-02',
        sent_at: new Date('2025-06-20T11:00:00Z').toISOString(),
        email_type: 'payment_receipt_agent',
        recipient: 'agent@wuxibyd.com',
        subject: 'Payment Receipt Submitted for Order ord-002',
        body: '<p>A payment receipt has been submitted by Jane Smith...</p>',
        status: 'sent',
    }
];

export const mockUsers: User[] = [
    {
        id: 'admin-user-id-placeholder', // This will be replaced by actual Firebase UID on login
        name: 'Admin User',
        email: 'admin@waxibyd.com',
        balance: 500000,
    },
    {
        id: 'mock-user-3',
        name: 'Test User',
        email: 'test@example.com',
        balance: 150000,
    }
];


export const mockInvestments: Investment[] = [
    {
        id: 'inv-01',
        userId: 'admin-user-id-placeholder',
        amount: 50000,
        description: 'User Investment #123',
        date: '2025-05-20'
    },
     {
        id: 'inv-02',
        userId: 'admin-user-id-placeholder',
        amount: 25000,
        description: 'User Investment #456',
        date: '2025-06-10'
    }
];

export const mockDeposits: Deposit[] = [
  {
    id: 'dep-001',
    userId: 'mock-user-3',
    userName: 'Test User',
    userEmail: 'test@example.com',
    amount: 50000,
    method: 'Bank Deposit',
    status: 'Pending',
    request_date: '2025-07-02',
  },
  {
    id: 'dep-002',
    userId: 'admin-user-id-placeholder',
    userName: 'Admin User',
    userEmail: 'admin@waxibyd.com',
    amount: 100000,
    method: 'Crypto',
    status: 'Completed',
    request_date: '2025-07-01',
  }
];