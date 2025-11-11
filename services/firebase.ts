// This is a placeholder for your Firebase configuration.
// In a real project, this would be populated with your actual Firebase project keys.
const firebaseConfig = {
  apiKey: "AIzaSyBbvjDDFf7kb5tdvv5iOR2v29HFcb-vBhU",
  authDomain: "tick-c20ac.firebaseapp.com",
  databaseURL: "https://tick-c20ac-default-rtdb.firebaseio.com",
  projectId: "tick-c20ac",
  storageBucket: "tick-c20ac.firebasestorage.app",
  messagingSenderId: "717973440095",
  appId: "1:717973440095:web:31b092f3e09fbb4a15bdea",
  measurementId: "G-5VCKKEBTQP"
};

// --- Firebase Initialization with Validation ---

// Helper to map config keys to environment variable names for the error message
const keyToEnvVar: { [key: string]: string } = {
    apiKey: 'FIREBASE_API_KEY',
    authDomain: 'FIREBASE_AUTH_DOMAIN',
    projectId: 'FIREBASE_PROJECT_ID',
    storageBucket: 'FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
    appId: 'FIREBASE_APP_ID',
};

// 1. Validate that the environment variables are present
const missingKeys = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

if (missingKeys.length > 0) {
    const missingEnvVars = missingKeys.map(key => keyToEnvVar[key] || key);
    const errorMessage = `FATAL: Firebase configuration is missing. The following environment variables are not set: ${missingEnvVars.join(', ')}. The application cannot start. Please configure them in your deployment environment.`;
    console.error(errorMessage);
    // Throwing an error here will stop the app from rendering and show the cause in the console.
    throw new Error(errorMessage);
}

// 2. Validate that the Firebase SDK has loaded
if (!(window as any).firebase || !(window as any).firebase.initializeApp) {
    const errorMessage = "FATAL: Firebase SDK not found on window object. Please ensure the Firebase scripts are correctly included in index.html before the main app script.";
    console.error(errorMessage);
    throw new Error(errorMessage);
}

// 3. Initialize Firebase and export the services
let app, auth, db;
try {
    // Check if Firebase is already initialized to prevent re-initialization errors
    if (!(window as any).firebase.apps.length) {
        app = (window as any).firebase.initializeApp(firebaseConfig);
    } else {
        app = (window as any).firebase.app(); // Get the default app if already initialized
    }
    auth = app.auth();
    db = app.firestore();
} catch (error) {
    const errorMessage = `FATAL: Firebase initialization failed. This can be caused by invalid configuration values. Please verify your Firebase project settings. Original error: ${error instanceof Error ? error.message : String(error)}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
}

export { app, auth, db };
