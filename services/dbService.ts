
import { Order, InstallmentPlan, GiveawayEntry, EmailLog } from '../types';

// This file simulates a real-time, in-memory database.
// In a real application, these functions would make async calls to a service like Supabase.

const db = {
  orders: [
    { id: 'ORD-001', customer_name: 'Li Wei', customer_email: 'li.wei@example.com', vehicle_name: 'BYD Seal', vehicle_id: 1, total_price: 212800, order_date: '2024-06-15', payment_status: 'Paid', fulfillment_status: 'Delivered', receipt_url: 'https://example.com/receipt1.pdf' },
    { id: 'ORD-002', customer_name: 'Zhang Min', customer_email: 'zhang.min@example.com', vehicle_name: 'BYD Dolphin', vehicle_id: 3, total_price: 116800, order_date: '2024-06-20', payment_status: 'Paid', fulfillment_status: 'Processing', receipt_url: 'https://example.com/receipt2.pdf' },
    { id: 'ORD-003', customer_name: 'Wang Hao', customer_email: 'wang.hao@example.com', vehicle_name: 'BYD Tang EV', vehicle_id: 5, total_price: 282800, order_date: '2024-06-22', payment_status: 'Paid', fulfillment_status: 'Delivered', receipt_url: 'https://example.com/receipt3.pdf' },
    { id: 'ORD-004', customer_name: 'Liu Chen', customer_email: 'liu.chen@example.com', vehicle_name: 'Yangwang U8', vehicle_id: 9, total_price: 1098000, order_date: '2024-06-25', payment_status: 'Verifying', fulfillment_status: 'Processing', receipt_url: 'https://example.com/receipt4.pdf' },
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
};

// --- GETTERS ---
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
