// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7EguaeCLlu-jVEmZM4RsoqB4uHbyl7Bw",
  authDomain: "gsba-991b0.firebaseapp.com",
  projectId: "gsba-991b0",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gsba-991b0.firebasestorage.app",
  messagingSenderId: "386550800112",
  appId: "1:386550800112:web:7de7ebac9e5e74f5182c35"
};

// Initialize Firebase
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} catch {
  firestoreDb = getFirestore(app);
}
export const db = firestoreDb;

// Initialize Storage
export const storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`);