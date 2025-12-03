/**
 * Frontend AI service client.
 * Calls a backend endpoint (Cloud Function) that interfaces with Gemini 2.5 Flash.
 * The backend is responsible for auth, rate-limiting, and calling Gemini.
 */
import { auth } from './firebase';

export interface AiDesignRequest {
  pageId: string;
  prompt: string;
  imageUrls?: string[];
  siteTheme?: 'dark' | 'light' | string;
}

export const requestAiDesign = async (payload: AiDesignRequest): Promise<any> => {
  // Try to include Firebase ID token for backend auth (if user is signed in)
  let idToken: string | null = null;
  try {
    const user = auth.currentUser;
    if (user) idToken = await user.getIdToken();
  } catch (err) {
    console.warn('Failed to get ID token for AI request:', err);
  }

  const resp = await fetch('/aiDesign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`AI design request failed: ${resp.status} ${text}`);
  }

  const result = await resp.json();
  return result;
};

export default { requestAiDesign };
