// This service is now configured for a real backend API layer.
// These functions make a `fetch` request to a Supabase Edge Function.
// That Edge Function is responsible for securely using an email provider's API
// (like Resend or SendGrid) to send the actual email and log it to the database.

const SUPABASE_URL = 'https://yxzjirgmrjktinogvyqo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4emppcmdtcmprdGlub2d2eXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMzYwNzYsImV4cCI6MjA3NzcxMjA3Nn0.kg45SVdKgp9MH9NTDHJG3XEtRbVICRkevei0-S14VBQ';

// This should match the name of your deployed Edge Function.
const sendEmailFunctionUrl = `${SUPABASE_URL}/functions/v1/send-email`;

// FIX: Added 'giveaway_payment_request_agent' and 'giveaway_payment_receipt_agent' to the type union
// to match the types used in `emailService.ts` and defined in `types.ts`, resolving type errors.
interface SendEmailPayload {
  email_type: 'order_confirmation' | 'installment_confirmation' | 'giveaway_confirmation' | 'payment_request_agent' | 'payment_receipt_agent' | 'deposit_request_agent' | 'deposit_receipt_agent' | 'giveaway_payment_request_agent' | 'giveaway_payment_receipt_agent';
  recipient: string;
  subject: string;
  body: string;
}

/**
 * Calls a backend endpoint (a Supabase Edge Function) to send an email.
 * The backend handles the actual email sending and logging to the database.
 */
export const apiSendEmail = async (payload: SendEmailPayload): Promise<{ success: boolean }> => {
  console.log(`[API Service] Making a real fetch request to Supabase Edge Function for ${payload.recipient}.`);

  try {
    const response = await fetch(sendEmailFunctionUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // The anon key is safe to use in the browser for invoking functions.
            // You should configure your function to only be callable by authenticated users if needed.
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`[API Service] Network response was not ok. Status: ${response.status}`, errorBody);
        // In a real app, you might want to log this failed attempt to a monitoring service.
        return { success: false };
    }
    
    // The Supabase function should return a success message upon completion.
    const result = await response.json();
    console.log(`[API Service] Successfully sent email via backend:`, result);
    return { success: true };

  } catch (error) {
    console.error('[API Service] Error calling the send-email Edge Function:', error);
    return { success: false };
  }
};
