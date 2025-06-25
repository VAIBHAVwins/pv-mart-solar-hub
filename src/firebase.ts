// ENHANCED BY CURSOR AI: Firebase initialization and exports
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCjNl9RX_wRYH-SkgTTxOxaZLF_96AbD74",
  authDomain: "solar-platform-10b57.firebaseapp.com",
  projectId: "solar-platform-10b57",
  storageBucket: "solar-platform-10b57.appspot.com",
  messagingSenderId: "620361736100",
  appId: "1:620361736100:web:d0ae2f9b6023484b5eeb31",
  measurementId: "G-WPECVQ9YX6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 