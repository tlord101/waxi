AI Design Cloud Function

This folder contains a minimal Express-based HTTP endpoint for AI page design.

What it does
- Provides POST /aiDesign which accepts { pageId, prompt, imageUrls, siteTheme }
- Verifies Firebase ID token passed as Bearer token and requires admin custom claim
- Returns a mock JSON design spec when GEMINI API key is not configured (safe local dev)

How to deploy (Firebase Functions)
1. Install Firebase CLI and login: `npm i -g firebase-tools` then `firebase login`
2. From this folder run `npm install` to install function deps.
3. Deploy using Firebase: from the repo root run `firebase deploy --only functions` or configure `firebase.json` to route this file.

Gemini integration
This scaffold intentionally returns a mock spec unless you set `GEMINI_API_KEY` or `GOOGLE_API_KEY` in the function environment and implement the Gemini call where noted.
Store credentials in Cloud Functions environment or Secret Manager.

Security
- The endpoint checks Firebase ID token and expects an admin custom claim (e.g. `admin: true` or `isAdmin: true`).
AI Cloud Function (scaffold)
=================================

This folder contains a minimal HTTP Cloud Function scaffold `index.js` that exposes `/aiDesign`.

What it does
- Verifies Firebase ID token and requires an admin claim.
- Accepts POST body: `{ pageId, prompt, imageUrls, siteTheme }`.
- If `USE_MOCK_AI=true` or `GEMINI_CONFIGURED` not set, returns a safe mock JSON spec.
- Otherwise it returns 501 and you must add the Gemini 2.5 Flash integration.

How to deploy (Firebase Functions)
1. Install dependencies and deploy from this folder or configure in your Firebase project:

```bash
cd functions
npm install
# Optionally set environment variables in Cloud Functions for production
# e.g. gcloud functions deploy aiDesign --runtime nodejs18 --trigger-http --allow-unauthenticated --set-env-vars "GEMINI_CONFIGURED=1"
```

2. The function currently exports `app` (Express). Adapt to your hosting model — Firebase Functions typically use `exports.aiDesign = functions.https.onRequest(app)`.

Gemini 2.5 Flash integration notes
- Use a Google Cloud service account and call the Generative Models API server-side.
- Request a JSON-only response by instructing the model to output strict JSON matching your schema.
- Validate the returned JSON before saving to Firestore or returning to the client.

Security
- Keep Gemini credentials and service account permissions only on the server.
- The function checks Firebase ID tokens; ensure admin claim is set for admin users.
