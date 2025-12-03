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
// --- Firebase Initialization (compat) ---
// Use the compat SDK so existing code that uses the older names (auth.createUserWithEmailAndPassword,
// firestore.collection(...), auth.onAuthStateChanged as a method, etc.) continues to work without
// a full rewrite to the modular API.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

let app: firebase.app.App;
try {
    if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
    } else {
        app = firebase.app();
    }
} catch (err) {
    console.error('Firebase initialization error:', err);
    throw err;
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { app, auth, db, storage };
