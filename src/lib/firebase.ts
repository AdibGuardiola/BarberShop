import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 CONFIG DIRECTA SIN VARIABLES
const firebaseConfig = {
  apiKey: "AIzaSyCwNNnJAQ4kouHqa4_Q4Mnoo0feYksHaGs",
  authDomain: "techfix-next.firebaseapp.com",
  projectId: "techfix-next",
  storageBucket: "techfix-next.appspot.com",
  messagingSenderId: "460858536526",
  appId: "1:460858536526:web:107c65df00d372f0d6891f",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
