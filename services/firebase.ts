// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZrJPE8wonSbp4fJjW0MetjYSYn6zYwJ8",
  authDomain: "waxi-8b0ff.firebaseapp.com",
  projectId: "waxi-8b0ff",
  storageBucket: "waxi-8b0ff.firebasestorage.app",
  messagingSenderId: "503468828299",
  appId: "1:503468828299:web:d2e4e7f7b2a25cb069968e",
  measurementId: "G-PP9LDRX010"
};

// --- Firebase Initialization ---

// Validate that the Firebase SDK has loaded
if (!(window as any).firebase || !(window as any).firebase.initializeApp) {
    const errorMessage = "FATAL: Firebase SDK not found on window object. Please ensure the Firebase scripts are correctly included in index.html before the main app script.";
    console.error(errorMessage);
    throw new Error(errorMessage);
}

let app, auth, db;

try {
    // Initialize Firebase
    // Check if Firebase is already initialized to prevent re-initialization errors
    if (!(window as any).firebase.apps.length) {
        app = (window as any).firebase.initializeApp(firebaseConfig);
    } else {
        app = (window as any).firebase.app(); // Get the default app if already initialized
    }
    
    auth = app.auth();
    db = app.firestore();

} catch (error) {
    // Provide a more specific error message for common issues like `auth/configuration-not-found`.
    const originalErrorMessage = error instanceof Error ? error.message : String(error);
    let detailedErrorMessage = `FATAL: Firebase initialization failed. This can be caused by invalid configuration values. Please verify your Firebase project settings.`;
    if (originalErrorMessage.includes('auth/configuration-not-found')) {
        detailedErrorMessage += ` The error 'auth/configuration-not-found' often means that Firebase Authentication is not enabled for this project in the Firebase console, or the API key is invalid.`;
    }
    const finalErrorMessage = `${detailedErrorMessage} Original error: ${originalErrorMessage}`;
    console.error(finalErrorMessage);
    throw new Error(finalErrorMessage);
}

export { app, auth, db };
