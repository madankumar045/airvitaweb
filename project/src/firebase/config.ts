import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCnHlM70pw2uxYpTjYzePFHGgFRhl_OAB8",
  authDomain: "airvita-a6170.firebaseapp.com",
  projectId: "airvita-a6170",
  storageBucket: "airvita-a6170.firebasestorage.app",
  messagingSenderId: "697856656290",
  appId: "1:697856656290:web:2a37b5ca5459665b2ce8fb",
  measurementId: "G-4W3YKY2BLG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;