import { apiSendEmail } from './apiService';

const AGENT_EMAIL = 'agent@zhengzhoubyd.com';

export const sendDepositRequestToAgent = async (data: {
  userName: string;
  userEmail: string;
  amount: number;
  method: 'Crypto' | 'Bank Deposit';
}) => {
  const subject = `Deposit Request — ${data.method} from ${data.userName}`;
  const bodyContent = `
    <p><strong>${data.userName}</strong> (${data.userEmail}) has requested to deposit <strong>¥${data.amount.toLocaleString()}</strong> via ${data.method}.</p>
    <p>Please send them the necessary payment details to complete the transaction.</p>
    <p>Once the payment is received, please go to the Admin Panel under the 'Deposits' tab to confirm it and credit their account.</p>
  `;
  const emailHtml = `<div style="font-family: sans-serif; padding: 1rem;"><p>This is an automated notification for the payment agent.</p>${bodyContent}</div>`;
  
  console.log(`--- Preparing email for API ---\nTo: ${AGENT_EMAIL}\nSubject: ${subject}\n-----------------------------`);

  return await apiSendEmail({
    email_type: 'deposit_request_agent',
    recipient: AGENT_EMAIL,
    subject: subject,
    body: emailHtml,
  });
};

export const sendDepositReceiptToAgent = async (data: {
  userName: string;
  userEmail: string;
  depositId: string;
  amount: number;
  receiptUrl: string;
}) => {
  const subject = `Deposit Receipt Submitted for Deposit ${data.depositId}`;
  const bodyContent = `
    <p>A deposit receipt has been submitted by <strong>${data.userName}</strong> (${data.userEmail}) for a deposit of <strong>¥${data.amount.toLocaleString()}</strong>.</p>
    <p><strong>Deposit ID:</strong> ${data.depositId}</p>
    <p>Please review the receipt at the following link: <a href="${data.receiptUrl}">View Receipt</a></p>
    <p>After verifying the payment, please go to the Admin Panel under the 'Deposits' tab to confirm it and credit the user's account.</p>
  `;
  const emailHtml = `<div style="font-family: sans-serif; padding: 1rem;"><p>This is an automated notification for the payment agent.</p>${bodyContent}</div>`;

  console.log(`--- Preparing email for API ---\nTo: ${AGENT_EMAIL}\nSubject: ${subject}\n-----------------------------`);

  return await apiSendEmail({
    email_type: 'deposit_receipt_agent',
    recipient: AGENT_EMAIL,
    subject: subject,
    body: emailHtml,
  });
};


export const sendPaymentRequestToAgent = async (data: {
  customerName: string;
  amount: number;
  paymentMethod: 'Crypto' | 'Bank Deposit';
  customerEmail: string;
}) => {
  let subject = '';
  let bodyContent = '';

  if (data.paymentMethod === 'Bank Deposit') {
    subject = `Payment Request — Bank Deposit from ${data.customerName}`;
    bodyContent = `
      <p><strong>${data.customerName}</strong> wants to make a payment of <strong>¥${data.amount.toLocaleString()}</strong> via bank deposit and is awaiting your response.</p>
      <p>Please send the verified bank account details to the customer's registered email address (<strong>${data.customerEmail}</strong>) to complete the transaction.</p>
    `;
  } else { // Crypto
    subject = `Payment Request — Crypto Payment from ${data.customerName}`;
    bodyContent = `
      <p><strong>${data.customerName}</strong> wants to make a payment of <strong>¥${data.amount.toLocaleString()}</strong> via crypto payment method and is awaiting your response.</p>
      <p>Please send the verified wallet address to the customer's registered email address (<strong>${data.customerEmail}</strong>) to complete the transaction.</p>
    `;
  }
  
  const emailHtml = `<div style="font-family: sans-serif; padding: 1rem;"><p>This is an automated notification for the payment agent.</p>${bodyContent}</div>`;

  console.log(`--- Preparing email for API ---\nTo: ${AGENT_EMAIL}\nSubject: ${subject}\n-----------------------------`);
  
  return await apiSendEmail({
    email_type: 'payment_request_agent',
    recipient: AGENT_EMAIL,
    subject: subject,
    body: emailHtml,
  });
};

export const sendReceiptSubmissionToAgent = async (data: {
  customerName: string;
  customerEmail: string;
  orderId: string;
  vehicleName: string;
  receiptUrl: string; // This would be a real URL in production
}) => {
  const subject = `Payment Receipt Submitted for Order ${data.orderId}`;
  const bodyContent = `
    <p>A payment receipt has been submitted by <strong>${data.customerName}</strong> (${data.customerEmail}) for their order of a <strong>${data.vehicleName}</strong>.</p>
    <p><strong>Order ID:</strong> ${data.orderId}</p>
    <p>Please review the receipt at the following (simulated) link: <a href="${data.receiptUrl}">View Receipt</a></p>
    <p>After verifying the payment, please go to the Admin Panel to mark the payment as successful. This will trigger the final confirmation to the customer.</p>
  `;
  const emailHtml = `<div style="font-family: sans-serif; padding: 1rem;"><p>This is an automated notification for the payment agent.</p>${bodyContent}</div>`;

  console.log(`--- Preparing email for API ---\nTo: ${AGENT_EMAIL}\nSubject: ${subject}\n-----------------------------`);

  return await apiSendEmail({
    email_type: 'payment_receipt_agent',
    recipient: AGENT_EMAIL,
    subject: subject,
    body: emailHtml,
  });
};

export const sendGiveawayPaymentRequestToAgent = async (data: {
  customerName: string;
  customerEmail: string;
  fee: number;
}) => {
  const subject = `Giveaway Entry Payment Request from ${data.customerName}`;
  const bodyContent = `
    <p><strong>${data.customerName}</strong> (${data.customerEmail}) wants to pay the giveaway entry fee of <strong>¥${data.fee.toLocaleString()}</strong>.</p>
    <p>Please send them the necessary bank or crypto details to complete the payment.</p>
  `;
  const emailHtml = `<div style="font-family: sans-serif; padding: 1rem;"><p>This is an automated notification for the payment agent.</p>${bodyContent}</div>`;

  return await apiSendEmail({
    email_type: 'giveaway_payment_request_agent',
    recipient: AGENT_EMAIL,
    subject: subject,
    body: emailHtml,
  });
};

export const sendGiveawayReceiptToAgent = async (data: {
  customerName: string;
  customerEmail: string;
  entryId: string;
  receiptUrl: string;
}) => {
  const subject = `Giveaway Receipt Submitted for Entry ${data.entryId}`;
  const bodyContent = `
    <p>A receipt has been submitted by <strong>${data.customerName}</strong> (${data.customerEmail}) for their giveaway entry.</p>
    <p><strong>Entry ID:</strong> ${data.entryId}</p>
    <p>Please review the receipt: <a href="${data.receiptUrl}">View Receipt</a></p>
    <p>After verifying, go to the Admin Panel -> Giveaway tab to confirm the payment.</p>
  `;
  const emailHtml = `<div style="font-family: sans-serif; padding: 1rem;"><p>This is an automated notification for the payment agent.</p>${bodyContent}</div>`;

  return await apiSendEmail({
    email_type: 'giveaway_payment_receipt_agent',
    recipient: AGENT_EMAIL,
    subject: subject,
    body: emailHtml,
  });
};


const createEmailTemplate = (title: string, content: string) => `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #000; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0; color: #d9001b; font-size: 28px;">WUXI BYD</h1>
    </div>
    <div style="padding: 30px;">
      <h2 style="color: #d9001b; font-size: 22px;">${title}</h2>
      ${content}
      <p style="margin-top: 30px; font-size: 14px; color: #777;">Thank you for choosing Wuxi BYD Vehicles Co., Ltd.</p>
    </div>
    <div style="background-color: #f8f8f8; color: #777; padding: 20px; text-align: center; font-size: 12px;">
      <p>&copy; ${new Date().getFullYear()} Wuxi BYD Vehicles Co., Ltd. All Rights Reserved.</p>
    </div>
  </div>
`;

export const sendOrderConfirmation = async (email: string, data: { name: string, vehicleName: string, price: number }) => {
  const subject = `Your BYD ${data.vehicleName} Order is Confirmed!`;
  const content = `
    <p>Dear ${data.name},</p>
    <p>Great news! Your payment has been successfully verified, and your order for the <strong>BYD ${data.vehicleName}</strong> is now confirmed.</p>
    <p><strong>Total Amount Paid:</strong> ¥${data.price.toLocaleString()}</p>
    <p>Our team will contact you shortly to arrange the final details and delivery. We are excited for you to experience the future of driving!</p>
  `;
  const emailHtml = createEmailTemplate(subject, content);

  console.log(`--- Preparing email for API ---\nTo: ${email}\nSubject: ${subject}\n-----------------------------`);

  return await apiSendEmail({
    email_type: 'order_confirmation',
    recipient: email,
    subject: subject,
    body: emailHtml,
  });
};

export const sendInstallmentConfirmation = async (email: string, data: { name: string, vehicleName: string, monthlyPayment: number, loanTerm: string }) => {
  const subject = `Your BYD ${data.vehicleName} Financing Application is Approved!`;
  const content = `
    <p>Dear ${data.name},</p>
    <p>Congratulations! Your financing application for the <strong>BYD ${data.vehicleName}</strong> has been successfully approved.</p>
    <p>Your estimated monthly payment will be <strong>¥${data.monthlyPayment.toFixed(2)}</strong> for ${data.loanTerm} months.</p>
    <p>We've sent a separate email with your full payment schedule and contract. Our team will be in touch soon!</p>
  `;
  const emailHtml = createEmailTemplate(subject, content);

  console.log(`--- Preparing email for API ---\nTo: ${email}\nSubject: ${subject}\n-----------------------------`);

  return await apiSendEmail({
    email_type: 'installment_confirmation',
    recipient: email,
    subject: subject,
    body: emailHtml,
  });
};

export const sendGiveawayConfirmation = async (email: string, data: { name: string, raffleCode: string }) => {
  const subject = `Your BYD Dolphin Giveaway Entry is Confirmed!`;
  const content = `
    <p>Dear ${data.name},</p>
    <p>Thank you for entering our giveaway! Your entry is confirmed, and you're one step closer to potentially winning a brand new BYD Dolphin.</p>
    <p>Your unique raffle code is:</p>
    <div style="background-color: #f0f0f0; border: 2px dashed #d9001b; padding: 15px; text-align: center; margin: 20px 0;">
      <strong style="font-size: 24px; letter-spacing: 2px;">${data.raffleCode}</strong>
    </div>
    <p>Please keep this code safe. We will announce the winner after the giveaway period ends. Good luck!</p>
  `;
  const emailHtml = createEmailTemplate(subject, content);
  
  console.log(`--- Preparing email for API ---\nTo: ${email}\nSubject: ${subject}\n-----------------------------`);

  return await apiSendEmail({
    email_type: 'giveaway_confirmation',
    recipient: email,
    subject: subject,
    body: emailHtml,
  });
};