import { Order, InstallmentPlan, GiveawayEntry, EmailLog, User, Investment, Vehicle } from '../types';

// This file simulates a real-time, in-memory database.
// In a real application, these functions would make async calls to a service like Supabase.

/**
 * Simulates a secure password hashing function.
 * In a real production environment, use a strong, salted hashing algorithm
 * like Argon2 or bcrypt on the server-side. This is for demonstration purposes only.
 */
const hashPassword = (password: string): string => {
  // This simple, non-secure transformation demonstrates the concept of hashing.
  // It is not cryptographically secure and should not be used in production.
  return `hashed_${password}_salted_v1`;
};


const db = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', password_hash: hashPassword('password123'), balance: 500000 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', password_hash: hashPassword('securepass'), balance: 120000 },
  ] as User[],
  vehicles: [
      {
        id: 1,
        name: 'BYD Seal',
        type: 'Sedan',
        price: 212800,
        description: 'A sleek, high-performance electric sedan with Ocean Aesthetics design.',
        imageUrl: 'https://picsum.photos/seed/bydseal/800/600',
        specs: [
          { icon: 'flash-outline', name: 'Range', value: '700km' },
          { icon: 'rocket-outline', name: '0-100km/h', value: '3.8s' },
          { icon: 'battery-charging-outline', name: 'Battery', value: '82.5 kWh' },
          { icon: 'speedometer-outline', name: 'Top Speed', value: '180 km/h' },
        ],
      },
      {
        id: 2,
        name: 'BYD Yuan Plus',
        type: 'SUV',
        price: 139800,
        description: 'A dynamic and energetic compact SUV, formerly known as Atto 3.',
        imageUrl: 'https://picsum.photos/seed/bydatto3/800/600',
        specs: [
          { icon: 'flash-outline', name: 'Range', value: '480km' },
          { icon: 'rocket-outline', name: '0-100km/h', value: '7.3s' },
          { icon: 'battery-charging-outline', name: 'Battery', value: '60.5 kWh' },
          { icon: 'speedometer-outline', name: 'Top Speed', value: '160 km/h' },
        ],
      },
      {
        id: 3,
        name: 'BYD Dolphin',
        type: 'Hatchback',
        price: 116800,
        description: 'An agile and stylish city car, perfect for urban adventures.',
        imageUrl: 'https://picsum.photos/seed/byddolphin/800/600',
        specs: [
          { icon: 'flash-outline', name: 'Range', value: '420km' },
          { icon: 'rocket-outline', name: '0-100km/h', value: '7.9s' },
          { icon: 'battery-charging-outline', name: 'Battery', value: '44.9 kWh' },
          { icon: 'speedometer-outline', name: 'Top Speed', value: '150 km/h' },
        ],
      },
      {
        id: 4,
        name: 'BYD Han EV',
        type: 'Sedan',
        price: 232800,
        description: 'A flagship luxury sedan that redefines performance and comfort.',
        imageUrl: 'https://picsum.photos/seed/bydhan/800/600',
        specs: [
          { icon: 'flash-outline', name: 'Range', value: '610km' },
          { icon: 'rocket-outline', name: '0-100km/h', value: '3.9s' },
          { icon: 'battery-charging-outline', name: 'Battery', value: '85.4 kWh' },
          { icon: 'speedometer-outline', name: 'Top Speed', value: '185 km/h' },
        ],
      },
      {
        id: 5,
        name: 'BYD Tang EV',
        type: 'SUV',
        price: 282800,
        description: 'A powerful and spacious 7-seater SUV for the whole family.',
        imageUrl: 'https://picsum.photos/seed/bydtang/800/600',
        specs: [
          { icon: 'flash-outline', name: 'Range', value: '505km' },
          { icon: 'rocket-outline', name: '0-100km/h', value: '4.4s' },
          { icon: 'battery-charging-outline', name: 'Battery', value: '86.4 kWh' },
          { icon: 'people-outline', name: 'Seating', value: '7' },
        ],
      },
      {
        id: 6,
        name: 'BYD Song Plus',
        type: 'SUV',
        price: 154800,
        description: 'A best-selling compact SUV known for its efficiency and style.',
        imageUrl: 'https://picsum.photos/seed/bydsong/800/600',
        specs: [
          { icon: 'flash-outline', name: 'Range', value: '505km' },
          { icon: 'rocket-outline', name: '0-100km/h', value: '8.5s' },
          { icon: 'battery-charging-outline', name: 'Battery', value: '71.7 kWh' },
          { icon: 'speedometer-outline', name: 'Top Speed', value: '175 km/h' },
        ],
      },
      {
        id: 7,
        name: 'BYD eBus',
        type: 'Commercial',
        price: 1800000,
        description: 'A reliable and zero-emission solution for public transportation.',
        imageUrl: 'https://picsum.photos/seed/bydebus/800/600',
        specs: [
          { icon: 'flash-outline', name: 'Range', value: '250km' },
          { icon: 'people-outline', name: 'Capacity', value: '90 passengers' },
          { icon: 'battery-charging-outline', name: 'Battery', value: '324 kWh' },
          { icon: 'speedometer-outline', name: 'Top Speed', value: '70 km/h' },
        ],
      },
      {
        id: 8,
        name: 'BYD eTruck',
        type: 'Commercial',
        price: 1200000,
        description: 'A powerful and efficient electric truck for logistics and heavy-duty tasks.',
        imageUrl: 'https://picsum.photos/seed/bydetruck/800/600',
        specs: [
          { icon: 'flash-outline', name: 'Range', value: '200km' },
          { icon: 'layers-outline', name: 'Payload', value: '25 tons' },
          { icon: 'battery-charging-outline', name: 'Battery', value: '177 kWh' },
          { icon: 'speedometer-outline', name: 'Top Speed', value: '85 km/h' },
        ],
      },
      {
        id: 9,
        name: 'Yangwang U8',
        type: 'Special',
        price: 1098000,
        description: 'A luxury off-road SUV with advanced technology, including tank turns and float mode.',
        imageUrl: 'https://picsum.photos/seed/bydu8/800/600',
        specs: [
          { icon: 'flash-outline', name: 'Range', value: '1000km' },
          { icon: 'rocket-outline', name: '0-100km/h', value: '3.6s' },
          { icon: 'power-outline', name: 'Horsepower', value: '1100 hp' },
          { icon: 'water-outline', name: 'Special', value: 'Amphibious' },
        ],
      },
    ] as Vehicle[],
  orders: [
    { id: 'ORD-001', userId: 1, customer_name: 'John Doe', customer_email: 'john@example.com', vehicle_name: 'BYD Seal', vehicle_id: 1, total_price: 212800, order_date: '2024-06-15', payment_status: 'Paid', fulfillment_status: 'Delivered', receipt_url: 'https://example.com/receipt1.pdf' },
    { id: 'ORD-002', customer_name: 'Zhang Min', customer_email: 'zhang.min@example.com', vehicle_name: 'BYD Dolphin', vehicle_id: 3, total_price: 116800, order_date: '2024-06-20', payment_status: 'Paid', fulfillment_status: 'Processing', receipt_url: 'https://example.com/receipt2.pdf' },
    { id: 'ORD-003', customer_name: 'Wang Hao', customer_email: 'wang.hao@example.com', vehicle_name: 'BYD Tang EV', vehicle_id: 5, total_price: 282800, order_date: '2024-06-22', payment_status: 'Paid', fulfillment_status: 'Delivered', receipt_url: 'https://example.com/receipt3.pdf' },
    { id: 'ORD-004', userId: 2, customer_name: 'Jane Smith', customer_email: 'jane@example.com', vehicle_name: 'Yangwang U8', vehicle_id: 9, total_price: 1098000, order_date: '2024-06-25', payment_status: 'Verifying', fulfillment_status: 'Processing', receipt_url: 'https://example.com/receipt4.pdf' },
  ] as Order[],
  installment_plans: [
    { id: 'INST-001', customer_name: 'Chen Jing', vehicle_name: 'BYD Yuan Plus', total_price: 139800, down_payment: 28000, monthly_payment: 3200, term_months: 36, start_date: '2024-05-01', status: 'Active' },
    { id: 'INST-002', customer_name: 'Wu Yue', vehicle_name: 'BYD Han EV', total_price: 232800, down_payment: 50000, monthly_payment: 3900, term_months: 48, start_date: '2024-04-10', status: 'Active' },
    { id: 'INST-003', customer_name: 'Zhao Feng', vehicle_name: 'BYD Song Plus', total_price: 154800, down_payment: 35000, monthly_payment: 2500, term_months: 48, start_date: '2023-01-15', status: 'Paid Off' },
  ] as InstallmentPlan[],
  giveaway_entries: [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', country: 'United Kingdom', raffle_code: 'BYD2025-A1B2', payment_status: 'Paid', winner_status: 'No' },
    { id: 2, name: 'Kenji Tanaka', email: 'kenji@example.com', country: 'Japan', raffle_code: 'BYD2025-C3D4', payment_status: 'Paid', winner_status: 'No' },
    { id: 3, name: 'Maria Garcia', email: 'maria@example.com', country: 'France', raffle_code: 'BYD2025-E5F6', payment_status: 'Paid', winner_status: 'No' },
    { id: 4, name: 'David Chen', email: 'david@example.com', country: 'Canada', raffle_code: 'BYD2025-G7H8', payment_status: 'Paid', winner_status: 'No' },
  ] as GiveawayEntry[],
  email_logs: [
    { id: 1, email_type: 'order_confirmation', recipient: 'li.wei@example.com', subject: 'Your BYD Seal Order Confirmation', status: 'sent', sent_at: '2024-06-15T10:05:00Z', body: `<p>Dear Li Wei,</p><p>Thank you for your purchase! We've received your order for the <strong>BYD Seal</strong>.</p><p><strong>Total Amount:</strong> ¥212,800</p><p>Our team will contact you shortly to arrange the final details and delivery.</p>` },
    { id: 2, email_type: 'installment_confirmation', recipient: 'chen.jing@example.com', subject: 'Your BYD Yuan Plus Financing Application is Approved!', status: 'sent', sent_at: '2024-05-01T14:20:00Z', body: `<p>Dear Chen Jing,</p><p>Congratulations! Your financing application for the <strong>BYD Yuan Plus</strong> has been successfully approved.</p><p>Your estimated monthly payment will be <strong>¥3,200.00</strong> for 36 months.</p>` },
    { id: 3, email_type: 'giveaway_confirmation', recipient: 'alice@example.com', subject: 'Your BYD Dolphin Giveaway Entry is Confirmed!', status: 'sent', sent_at: '2024-06-18T09:00:00Z', body: `<p>Dear Alice Smith,</p><p>Thank you for entering our giveaway! Your entry is confirmed.</p><p>Your unique raffle code is: <strong>BYD2025-A1B2</strong></p><p>Good luck!</p>` },
    { id: 4, email_type: 'order_confirmation', recipient: 'wang.hao@example.com', subject: 'Your BYD Tang EV Order Confirmation', status: 'sent', sent_at: '2024-06-22T11:30:00Z', body: `<p>Dear Wang Hao,</p><p>Thank you for your purchase! We've received your order for the <strong>BYD Tang EV</strong>.</p><p><strong>Total Amount:</strong> ¥282,800</p><p>Our team will contact you shortly to arrange the final details and delivery.</p>` },
  ] as EmailLog[],
  investments: [
      { id: 1, userId: 1, amount: 25000, description: 'Renewable Energy Bond', date: '2024-03-10' },
      { id: 2, userId: 1, amount: 10000, description: 'EV Battery Tech Stock', date: '2024-05-20' },
  ] as Investment[],
};

// --- GETTERS ---
export const getVehicles = (): Vehicle[] => [...db.vehicles];
export const getOrders = (): Order[] => [...db.orders].sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime());
export const getInstallmentPlans = (): InstallmentPlan[] => db.installment_plans;
export const getGiveawayEntries = (): GiveawayEntry[] => db.giveaway_entries;
export const getEmailLogs = (): EmailLog[] => [...db.email_logs].sort((a, b) => new Date(b.sent_at as string).getTime() - new Date(a.sent_at as string).getTime());
export const getSalesOverTime = () => [
    { name: 'Jan', sales: 450000 },
    { name: 'Feb', sales: 480000 },
    { name: 'Mar', sales: 620000 },
    { name: 'Apr', sales: 710000 },
    { name: 'May', sales: 850000 },
    { name: 'Jun', sales: 980000 },
];
export const getInvestmentsForUser = (userId: number): Investment[] => {
    return [...db.investments.filter(inv => inv.userId === userId)].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};


// --- USER ACTIONS ---
export const findUserByEmail = (email: string): User | undefined => {
  return db.users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const addUser = (name: string, email: string, password: string): User | null => {
  if (findUserByEmail(email)) {
    // User already exists
    return null;
  }
  const newUser: User = {
    id: Date.now(),
    name,
    email,
    password_hash: hashPassword(password), // Store the hashed password
    balance: 0, // Start with a zero balance
  };
  db.users.push(newUser);
  console.log("New user added to DB:", newUser);
  return newUser;
};

export const loginUser = (email: string, password: string): User | null => {
  const user = findUserByEmail(email);
  const providedPasswordHash = hashPassword(password);

  // Compare the hashed version of the provided password with the stored hash
  if (user && user.password_hash === providedPasswordHash) {
    return user;
  }
  return null;
};

export const updateUser = (userId: number, updates: Partial<User>): User | undefined => {
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        db.users[userIndex] = { ...db.users[userIndex], ...updates };
        console.log("User updated in DB:", db.users[userIndex]);
        return db.users[userIndex];
    }
    return undefined;
};


// --- SETTERS / ACTIONS ---
export const addEmailLog = (log: Omit<EmailLog, 'id' | 'sent_at'>): void => {
    const newLog: EmailLog = {
        ...log,
        id: Date.now(),
        sent_at: new Date().toISOString()
    };
    db.email_logs.push(newLog);
    console.log("New email log added to DB:", newLog);
};

export const addOrder = (orderData: Omit<Order, 'id' | 'order_date'>): Order => {
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${String(Date.now()).slice(-4)}`,
    order_date: new Date().toISOString().split('T')[0],
  };
  db.orders.unshift(newOrder); // Add to the top
  console.log("New order added to DB:", newOrder);
  return newOrder;
};

export const updateOrder = (orderId: string, updates: Partial<Order>): Order | undefined => {
  const orderIndex = db.orders.findIndex(o => o.id === orderId);
  if (orderIndex > -1) {
    db.orders[orderIndex] = { ...db.orders[orderIndex], ...updates };
    console.log("Order updated in DB:", db.orders[orderIndex]);
    return db.orders[orderIndex];
  }
  return undefined;
};

export const addInvestment = (investmentData: Omit<Investment, 'id' | 'date'>): Investment => {
    const newInvestment: Investment = {
        ...investmentData,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
    };
    db.investments.push(newInvestment);
    console.log("New investment added to DB:", newInvestment);
    return newInvestment;
};

export const addVehicle = (vehicleData: Omit<Vehicle, 'id'>): Vehicle => {
    const newVehicle: Vehicle = {
        ...vehicleData,
        id: Date.now(),
    };
    db.vehicles.push(newVehicle);
    console.log("New vehicle added to DB:", newVehicle);
    return newVehicle;
};

export const updateVehicle = (vehicleData: Vehicle): Vehicle | undefined => {
    const vehicleIndex = db.vehicles.findIndex(v => v.id === vehicleData.id);
    if (vehicleIndex > -1) {
        db.vehicles[vehicleIndex] = vehicleData;
        console.log("Vehicle updated in DB:", db.vehicles[vehicleIndex]);
        return db.vehicles[vehicleIndex];
    }
    return undefined;
};

export const deleteVehicle = (vehicleId: number): boolean => {
    const initialLength = db.vehicles.length;
    db.vehicles = db.vehicles.filter(v => v.id !== vehicleId);
    const success = db.vehicles.length < initialLength;
    if (success) {
        console.log(`Vehicle with ID ${vehicleId} deleted from DB.`);
    }
    return success;
};
